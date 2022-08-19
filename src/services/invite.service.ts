import { HttpException } from "@exceptions/HttpException";
import { client, discordRest } from "@/utils/discord";
import { Request } from "express";
import customLinkSettingModel from "@/models/customLinkSetting.model";
import { verify } from "hcaptcha";
import { CAPTHCA_SECRET_KEY, NODE_ENV } from "@/config";
import { RESTJSONErrorCodes, Routes } from "discord.js";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { DiscordAPIError } from "@discordjs/rest";
import { Email, EmailVerify, PhoneVerify } from "@/dtos/invite.dto";
import mailSender from "@libs/email/mail";
import randomstring from "randomstring";
import { generateRandomNumber } from "@/utils/util";
import verifyEmailModel from "@/models/verifyEmail.model";
import { KAKAO_MESSAGE_TEMPLATE } from "@/interfaces/message.interface";
import sendMessage from "@/utils/message";
import verifyPhoneModel from "@/models/verifyPhone.model";
import { premiumGuildCheck } from "@/utils/premium";
import userModel from "@/models/users.model";

class InviteService {
  public customLink = customLinkSettingModel;

  public async getInvite(req: Request): Promise<any> {
    const customlink = await this.customLink.findOne({ path: req.params.id });
    if (!customlink) throw new HttpException(404, req.t("invite.notFound"));
    const guild = client.guilds.cache.get(customlink.guild_id);
    if (!guild) throw new HttpException(404, req.t("invite.notFound"));
    return {
      metadata: {
        name: guild.name,
        icon: guild.icon,
        id: guild.id,
      },
      option: customlink.option,
    };
  }

  public async verifyEmailToken(req: RequestWithUser): Promise<any> {
    const { token, code } = req.body as EmailVerify;
    const customlink = await verifyEmailModel.findOne({
      path: req.params.id,
      token,
      code,
    });
    if (!customlink) throw new HttpException(400, req.t("invite.invalidCode"));
    if (customlink.userId !== req.user.id)
      throw new HttpException(401, req.t("invite.unknownUser"));
    return null;
  }

  public async verifyPhone(req: RequestWithUser): Promise<any> {
    const customlink = await this.customLink.findOne({ path: req.params.id });
    const isPremium = await premiumGuildCheck(customlink.guild_id);
    if (!isPremium)
      throw new HttpException(403, req.t("verifyPhone.onlyPremium"));
    const code = generateRandomNumber(5);
    const token = randomstring.generate({ length: 30 });
    const verfiyPhoneDB = new verifyPhoneModel({
      path: customlink.path,
      userId: req.user.id,
      token,
      code,
      status: "open",
      phone: req.body.phone,
    });
    await verfiyPhoneDB.save().catch(() => {
      throw new HttpException(500, req.t("dataSaveError"));
    });
    try {
      await sendMessage(req.body.phone, KAKAO_MESSAGE_TEMPLATE.VERIFY_MESSAGE, {
        "#{이름}": req.user.user.username,
        "#{인증번호}": code,
      });
    } catch (e) {
      throw new HttpException(500, e.message);
    }
    return {
      token,
      phone: req.body.phone,
    };
  }

  public async verifyPhoneToken(req: RequestWithUser): Promise<any> {
    const { token, code } = req.body as PhoneVerify;
    const customlink = await verifyPhoneModel.findOne({
      path: req.params.id,
      token,
      code,
    });
    if (!customlink) throw new HttpException(400, req.t("invite.invalidCode"));
    if (customlink.userId !== req.user.id)
      throw new HttpException(401, req.t("invite.unknownUser"));
    await userModel.updateOne(
      { id: req.user.id },
      { $set: { phone: customlink.phone } }
    );
    return null;
  }

  public async verifyEmail(req: RequestWithUser): Promise<any> {
    const { email } = req.body as Email;
    const customlink = await this.customLink.findOne({ path: req.params.id });
    if (!customlink) throw new HttpException(404, req.t("invite.notFound"));
    const guild = client.guilds.cache.get(customlink.guild_id);
    if (!guild) throw new HttpException(404, req.t("invite.notFound"));
    const code = randomstring.generate({ length: 5 }).toUpperCase();
    const token = randomstring.generate({ length: 30 });
    const verifyEmail = new verifyEmailModel({
      path: customlink.path,
      userId: req.user.id,
      token,
      code,
      status: "open",
    });
    await verifyEmail.save().catch(() => {
      throw new HttpException(500, req.t("invite.emailSendCodeError"));
    });
    await mailSender
      .sendMail({
        email,
        data: {
          serverName: guild.name,
          code,
        },
        title: `[배틀이] ${guild.name} 서버 에서 인증을 요청합니다`,
        template: "verify",
      })
      .catch((e) => {
        throw new HttpException(500, req.t("invite.emailSendError"));
      });
    return token;
  }

  public async userInvite(req: RequestWithUser): Promise<any> {
    const customlink = await this.customLink.findOne({ path: req.params.id });
    if (!customlink) throw new HttpException(404, req.t("invite.notFound"));
    const guild = client.guilds.cache.get(customlink.guild_id);
    if (!guild) throw new HttpException(404, req.t("invite.notFound"));
    await verify(
      NODE_ENV === "development"
        ? "0x0000000000000000000000000000000000000000"
        : CAPTHCA_SECRET_KEY,
      req.body.token
    )
      .then((verifyRes) => {
        if (!verifyRes.success)
          throw new HttpException(400, req.t("invite.captchaError"));
      })
      .catch(() => {
        throw new HttpException(400, req.t("invite.captchaError"));
      });
    await discordRest
      .put(Routes.guildMember(guild.id, req.user.id), {
        body: {
          access_token: req.user.accessToken,
        },
      })
      .catch((error: DiscordAPIError) => {
        if (error.code === RESTJSONErrorCodes.InvalidOAuth2AccessToken)
          throw new HttpException(400, req.t("invite.loginRetry"));
        else if (error.code === RESTJSONErrorCodes.MaximumNumberOfGuildsReached)
          throw new HttpException(400, req.t("invite.maximumGuilds"));
        else if (error.code === RESTJSONErrorCodes.UnknownAccount)
          throw new HttpException(400, req.t("invite.unknownAccount"));
        else if (error.code === RESTJSONErrorCodes.UnknownUser)
          throw new HttpException(400, req.t("invite.unknownAccount"));
        else if (
          error.code === RESTJSONErrorCodes.MaximumNumberOfServerMembersReached
        )
          throw new HttpException(400, req.t("invite.maximumGuildMembers"));
        else if (error.code === RESTJSONErrorCodes.UserBannedFromThisGuild)
          throw new HttpException(400, req.t("invite.userBannedGuild"));
        else
          throw new HttpException(
            400,
            req.t("invite.unknownError", { code: error.code })
          );
      });
    await customlink.updateOne({ $inc: { useage: 1 } });
    return null;
  }
}

export default InviteService;
