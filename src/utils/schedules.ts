import billingsModel from "@/models/billings.model";
import paymentsModel from "@/models/payments.model";
import premiumGuildModel from "@/models/premiumGuild.model";
import productsModel from "@/models/products.model";
import { randomUUID } from "crypto";
import { scheduleJob } from "node-schedule";
import qs from "qs";
import { premiumCache } from "./cache";
import { kakaoPaymentsClient, tossClient } from "./payments";
import {
  guildPremiumErrorHanler,
  guildPremiumHanler,
  premiumGuildCheck,
} from "./premium";
export const billingSchedule = () =>
  scheduleJob("00 00 10 * * *", async () => {
    try {
      premiumCache.del(premiumCache.keys());
      const premiumGuilds = await premiumGuildModel.find();
      premiumGuilds.forEach(async (premiumGuild) => {
        const isPremium = await premiumGuildCheck(premiumGuild.guild_id);
        if (!isPremium) {
          const billing = await billingsModel.findOne({
            target: premiumGuild.guild_id,
            targetType: "guild",
          });
          if (!billing || !billing.useing) return;
          const item = await productsModel.findOne({ itemId: billing.itemId });
          const orderId = randomUUID();
          const paymentsDB = new paymentsModel({
            userId: billing.userId,
            orderId: orderId,
            amount: item.amount,
            process: "open",
            name: item.itemName,
            target: premiumGuild.guild_id,
            type: item.type,
            item: item.itemId,
          });
          const payments = await paymentsDB.save();
          if (billing.paymentsType === "tosspayments") {
            const tosspayments = await tossClient(
              "POST",
              "/v1/brandpay/payments",
              {
                customerKey: billing.userId,
                methodKey: billing.method,
                amount: Number(item.amount),
                orderId: payments.orderId,
                orderName: item.itemName,
              }
            );
            if (tosspayments.error) {
              await payments.updateOne(
                {
                  $push: {
                    paymentsErrors: {
                      message: tosspayments.message,
                      data: tosspayments.data,
                    },
                  },
                  $set: {
                    process: "error",
                  },
                }
              );
              await guildPremiumErrorHanler(
                premiumGuild.guild_id,
                billing.userId,
                tosspayments.message
              );
              return;
            }
            await payments.updateOne(
              {
                payment: tosspayments.data,
                process: "success",
              }
            );
            await guildPremiumHanler(
              payments.target,
              payments.item,
              billing.userId
            );
          } else if (billing.paymentsType === "kakaopay") {
            const kakaopay = await kakaoPaymentsClient(
              "POST",
              "/v1/payment/subscription",
              qs.stringify({
                cid: "TCSUBSCRIP",
                sid: billing.method,
                total_amount: item.amount,
                partner_order_id: payments.orderId,
                partner_user_id: payments.userId,
                item_name: item.itemName,
                quantity: 1,
                tax_free_amount: 0,
              })
            );
            if (kakaopay.error) {
              await payments.updateOne(
                {
                  $push: {
                    paymentsErrors: {
                      message: kakaopay.message,
                      data: kakaopay.data,
                    },
                  },
                  $set: {
                    process: "error",
                  },
                }
              );
              await guildPremiumErrorHanler(
                premiumGuild.guild_id,
                billing.userId,
                kakaopay.message
              );
              return;
            }
            await billing.updateOne(
              { $set: { method: kakaopay.data.sid } }
            );
            await payments.updateOne(
              {
                kakaoPayments: kakaopay.data,
                process: "success",
              }
            );
            await guildPremiumHanler(
              payments.target,
              payments.item,
              billing.userId
            );
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  });
