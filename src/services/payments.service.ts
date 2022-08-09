import { confirmPayment, newPayments, PaymentsGift } from "@/dtos/payments.dto";
import { HttpException } from "@/exceptions/HttpException";
import { RequestWithUser } from "@/interfaces/auth.interface";
import paymentsModel from "@/models/payments.model";
import sellItemModel from "@/models/products.model";
import userModel from "@/models/users.model";
import { client } from "@/utils/discord";
import { tossClient, tossPaymentsClient, tossRefreshToken } from "@/utils/toss";
import { randomUUID } from "crypto";
import type { Methods } from "@tosspayments/brandpay-types";
import { Payments, PaymentsMethods } from "@/interfaces/payments.interface";
import { guildPremiumHanler } from "@/utils/premium";
import premiumGuildModel from "@/models/premiumGuild.model";
import premiumUserModel from "@/models/premiumUser.model";
import { Document } from "mongoose";

class PaymentsService {
  public async getPayementsAuth(req: RequestWithUser): Promise<any> {
    const { code, customerKey } = req.query;
    if (!code) throw new HttpException(400, "필수 파라미터가 없습니다");
    if (!customerKey) throw new HttpException(400, "필수 파라미터가 없습니다");
    if (req.user.id !== customerKey)
      throw new HttpException(401, "유저 인증에 실페했습니다");
    const authData = await tossClient(
      "POST",
      "/v1/brandpay/authorizations/access-token",
      {
        grantType: "AuthorizationCode",
        code,
        customerKey,
      }
    );
    await userModel.updateOne(
      { id: req.user.id },
      {
        $set: {
          toss_accessToken: authData.data.accessToken,
          toss_refreshToken: authData.data.refreshToken,
          toss_tokenType: authData.data.tokenType,
        },
      }
    );
    if (authData.error)
      throw new HttpException(
        401,
        authData.message ? authData.message : "유저 인증에 실페했습니다"
      );
    return authData;
  }

  public async getPaymentsMethods(req: RequestWithUser): Promise<any> {
    let tossMethodsData = await tossClient(
      "GET",
      "/v1/brandpay/payments/methods",
      null,
      req.user.toss_accessToken as string
    );
    if (tossMethodsData.data.code === "INVALID_ACCESS_TOKEN") {
      const refreshToken = await tossRefreshToken(req.user);
      if (!refreshToken)
        throw new HttpException(401, "유저 인증에 실페했습니다");
      tossMethodsData = await tossClient(
        "GET",
        "/v1/brandpay/payments/methods",
        null,
        refreshToken.accessToken as string
      );
    }
    if (tossMethodsData.error)
      throw new HttpException(
        401,
        tossMethodsData.message
          ? tossMethodsData.message
          : "유저 인증에 실페했습니다"
      );
    const methodsData: Methods = tossMethodsData.data;
    const methods: PaymentsMethods[] = [];
    methodsData.accounts.forEach((account) => {
      return methods.push({
        type: "account",
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        id: account.id,
        iconUrl: account.iconUrl,
        select: methodsData.selectedMethodId === account.id ? true : false,
      });
    });
    methodsData.cards.forEach((card) => {
      return methods.push({
        type: "card",
        cardName: card.cardName,
        cardNumber: card.cardNumber,
        cardType: card.cardType,
        id: card.id,
        iconUrl: card.iconUrl,
        select: methodsData.selectedMethodId === card.id ? true : false,
      });
    });
    return methods;
  }

  public async confirmPayment(req: RequestWithUser): Promise<any> {
    const { amount, orderId, paymentKey, phone } = req.body as confirmPayment;
    const confirmData = await tossClient("POST", `/v1/payments/${paymentKey}`, {
      orderId,
      amount,
    });
    if (confirmData.error)
      throw new HttpException(
        confirmData.status ? confirmData.status : 500,
        confirmData.message ? confirmData.message : "결제 처리를 실패했습니다"
      );
    const payments = await paymentsModel.findOne({ orderId });
    await userModel.updateOne({ id: req.user.id }, { $set: { phone } });
    await paymentsModel.updateOne(
      { orderId },
      { $set: { payment: confirmData.data, process: "success" } }
    );
    await guildPremiumHanler(payments.target, payments.item, req.user.id);
    return confirmData.data;
  }

  public async getSuccessOrderCultureland(req: RequestWithUser): Promise<any> {
    const { orderId, amount, paymentKey, phone } = req.body as PaymentsGift;
    const payments = await paymentsModel.findOne({
      orderId: orderId,
    });
    if (!payments) throw new HttpException(404, "찾을 수 없는 주문정보입니다");
    if (payments.process === "success") throw new HttpException(409, "이미 처리가 완료된 주문정보입니다");
    const orderCulturelandData = await tossPaymentsClient(
      "POST",
      `/v1/payments/confirm`,
      {
        orderId,
        amount,
        paymentKey,
      }
    );
    if (orderCulturelandData.error) {
      throw new HttpException(
        orderCulturelandData.status ? orderCulturelandData.status : 500,
        orderCulturelandData.message ? orderCulturelandData.message : "결제 처리를 실패했습니다"
      );
    }
    await userModel.updateOne({ id: req.user.id }, { $set: { phone } });
    await paymentsModel.updateOne(
      { orderId },
      { $set: { payment: orderCulturelandData.data, process: "success" } }
    );
    await guildPremiumHanler(payments.target, payments.item, req.user.id);
    const paymentsMeta = await this.getPaymentsMetadata(orderId)
    return paymentsMeta;
  }

  public async addNewOrder(req: RequestWithUser): Promise<any> {
    const paymentsReq: newPayments = req.body;
    const user = req.user;
    const orderId = randomUUID();
    const item = await sellItemModel.findOne({ itemId: paymentsReq.itemId });
    if (!item) throw new HttpException(404, "해당 상품은 찾을 수 없습니다");
    const paymentsDB = new paymentsModel({
      userId: user.id,
      orderId: orderId,
      amount: item.amount,
      process: "open",
      name: item.itemName,
      target: paymentsReq.guildId,
      type: item.type,
      item: paymentsReq.itemId,
    });
    await paymentsDB.save().catch(() => {
      throw new HttpException(500, "결제 정보 생성중 오류가 발생했습니다");
    });
    return {
      paymentId: orderId,
    };
  }

  public async getSuccessOrder(req: RequestWithUser): Promise<any> {
    const payments = await paymentsModel.findOne({
      orderId: req.params.orderId,
    });
    if (!payments || req.user.id !== payments.userId)
      throw new HttpException(404, "해당 결제는 찾을 수 없습니다");
    const paymentsMeta = await this.getPaymentsMetadata(req.params.orderId)
    return paymentsMeta;
  }

  public async getOrder(req: RequestWithUser): Promise<any> {
    const payments = await paymentsModel.findOne({
      orderId: req.params.orderId,
    });
    if (!payments || payments.userId !== req.user.id)
      throw new HttpException(404, "해당 결제는 찾을 수 없습니다");
    if (payments.process === "success")
      throw new HttpException(400, "해당 결제는 이미 완료되었습니다");
    let itemMetadata;
    if (payments.type === "guild") {
      const guild = client.guilds.cache.get(payments.target);
      if (!guild)
        throw new HttpException(404, "구매를 진행하는 서버를 찾을 수 없습니다");
      itemMetadata = {
        type: "guild",
        id: guild.id,
        icon: guild.icon,
        name: guild.name,
      };
    } else if (payments.type === "user") {
      const user = client.users.cache.get(payments.target);
      if (!user)
        throw new HttpException(404, "구매를 진행하는 유저를 찾을 수 없습니다");
      itemMetadata = {
        type: "user",
        id: user.id,
        avatar: user.avatar,
        discriminator: user.discriminator,
        name: user.username,
      };
    }
    return {
      metadata: itemMetadata,
      name: payments.name,
      id: payments.orderId,
      amount: payments.amount,
    };
  }

  private async getPaymentsMetadata(orderId: string): Promise<any> {
    const payments = await paymentsModel.findOne({ orderId });
    let itemMetadata;
    let nextPayDate: Date;
    if (payments.type === "guild") {
      const guild = client.guilds.cache.get(payments.target);
      if (!guild)
        throw new HttpException(404, "결제를 진행했던 서버를 찾을 수 없습니다");
      itemMetadata = {
        type: "guild",
        id: guild.id,
        icon: guild.icon,
        name: guild.name,
      };
      const guildPremium = await premiumGuildModel.findOne({
        guild_id: guild.id,
      });
      nextPayDate = guildPremium.nextpay_date;
    } else if (payments.type === "user") {
      const user = client.users.cache.get(payments.target);
      if (!user)
        throw new HttpException(404, "결제를 진행했던 유저를 찾을 수 없습니다");
      itemMetadata = {
        type: "user",
        id: user.id,
        avatar: user.avatar,
        discriminator: user.discriminator,
        name: user.username,
      };
      const userPremium = await premiumUserModel.findOne({ user_id: user.id });
      nextPayDate = userPremium.nextpay_date;
    }
    return {
      metadata: itemMetadata,
      nextPayDate,
      ...payments.toJSON(),
    }
  }
}

export default PaymentsService;
