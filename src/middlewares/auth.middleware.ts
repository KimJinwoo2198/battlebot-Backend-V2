import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { BOT_TOKEN, SECRET_KEY } from "@config";
import { HttpException } from "@exceptions/HttpException";
import { DataStoredInToken, RequestWithUser } from "@interfaces/auth.interface";
import userModel from "@models/users.model";
import { RequestWithGuild } from "@/interfaces/guild.interface";
import { client } from "@utils/discord";
import { checkUserFlag } from "@/utils/util";
import { premiumGuildCheck } from "@/utils/premium";

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authorization =
      req.cookies["Authorization"] ||
      (req.header("Authorization")
        ? req.header("Authorization").split("Bearer ")[1]
        : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(
        Authorization,
        secretKey
      )) as DataStoredInToken;
      const userId = verificationResponse.id;
      const user = client.users.cache.get(userId);
      const findUser = await userModel.findOne({ id: userId });

      if (findUser) {
        req.user = {
          ...findUser.toJSON(),
          user: user ? user : await client.users.fetch(userId),
        };
        next();
      } else {
        next(new HttpException(401, req.t("auth.unknownUserToken")));
      }
    } else {
      next(new HttpException(401, req.t("auth.notToken")));
    }
  } catch (error) {
    next(new HttpException(401, req.t("auth.unknownUserToken")));
  }
};

const authAdminMiddleware = async (
  req: RequestWithGuild,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authorization =
      req.cookies["Authorization"] ||
      (req.header("Authorization")
        ? req.header("Authorization").split("Bearer ")[1]
        : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(
        Authorization,
        secretKey
      )) as DataStoredInToken;
      const userId = verificationResponse.id;
      const user = client.users.cache.get(userId);
      const findUser = await userModel.findOne({ id: userId });

      if (findUser) {
        req.user = {
          ...findUser.toJSON(),
          user: user ? user : await client.users.fetch(userId),
        };
        const guild = client.guilds.cache.get(req.params.id);
        if (guild) {
          const premium = await premiumGuildCheck(guild.id);
          if (!premium) {
            req.isPremium = false;
          } else {
            req.isPremium = true;
          }
          if (checkUserFlag(findUser.battlebot_flags, "admin")) {
            req.guild = guild;
            req.isAdmin = true;
            next();
          } else {
            const owner = await guild.members.fetch(findUser.id);
            if (owner) {
              if (
                owner.permissions.has("Administrator") ||
                owner.permissions.has("ManageGuild")
              ) {
                req.guild = guild;
                req.isAdmin = true;
                next();
              } else {
                next(
                  new HttpException(403, req.t("auth.notHaveManageServerPermission"))
                );
              }
            } else {
              next(
                new HttpException(
                  403,
                  req.t("auth.notFoundAdminUseChatServer")
                )
              );
            }
          }
        } else {
          next(new HttpException(404, req.t("server.notfound")));
        }
      } else {
        next(new HttpException(401, req.t("auth.unknownUserToken")));
      }
    } else {
      next(new HttpException(401, req.t("auth.notToken")));
    }
  } catch (error) {
    next(new HttpException(401, req.t("auth.unknownUserToken")));
  }
};

const authBotMiddleware = async (
  req: RequestWithGuild,
  res: Response,
  next: NextFunction
) => {
  try {
    const Authorization =
      req.cookies["Authorization"] ||
      (req.header("Authorization")
        ? req.header("Authorization").split("Bearer ")[1]
        : null);

    if (Authorization) {
      if (BOT_TOKEN === Authorization) {
        const guild = client.guilds.cache.get(req.params.id);
        if (guild) {
          const premium = await premiumGuildCheck(guild.id);
          if (!premium) {
            req.isPremium = false;
          } else {
            req.isPremium = true;
          }
          req.guild = guild;
          req.isAdmin = true;
          next();
        } else {
          next(new HttpException(401, req.t("server.notfoundThat")));
        }
      } else {
        next(new HttpException(401, req.t("auth.unknownUserToken")));
      }
    } else {
      next(new HttpException(401, req.t("auth.notToken")));
    }
  } catch (error) {
    next(new HttpException(401, req.t("auth.unknownUserToken")));
  }
};

export default authMiddleware;
export { authAdminMiddleware, authBotMiddleware };
