import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { BOT_TOKEN, SECRET_KEY } from "@config";
import { HttpException } from "@exceptions/HttpException";
import { DataStoredInToken, RequestWithUser } from "@interfaces/auth.interface";
import userModel from "@models/users.model";
import { RequestWithGuild } from "@/interfaces/guild.interface";
import { client } from "@utils/discord";
import premiumGuildModel from "@/models/premiumGuild.model";
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
        next(new HttpException(401, "올바르지 않은 유저 토큰입니다"));
      }
    } else {
      next(new HttpException(401, "유저 토큰이 없습니다"));
    }
  } catch (error) {
    next(new HttpException(401, "올바르지 않은 유저 토큰입니다"));
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
                  new HttpException(403, "해당 서버를 관리할 권한이 없습니다")
                );
              }
            } else {
              next(
                new HttpException(
                  403,
                  "해당 서버에서 관리자를 찾지 못했습니다. 서버에서 채팅 입력후 다시 시도해주세요."
                )
              );
            }
          }
        } else {
          next(new HttpException(404, "찾을 수 없는 서버입니다."));
        }
      } else {
        next(new HttpException(401, "올바르지 않은 유저 토큰입니다"));
      }
    } else {
      next(new HttpException(401, "유저 토큰이 없습니다"));
    }
  } catch (error) {
    next(new HttpException(401, "올바르지 않은 유저 토큰입니다"));
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
          next(new HttpException(401, "해당 서버를 찾을 수 없습니다"));
        }
      } else {
        next(new HttpException(401, "올바르지 않은 유저 토큰입니다"));
      }
    } else {
      next(new HttpException(401, "유저 토큰이 없습니다"));
    }
  } catch (error) {
    next(new HttpException(401, "올바르지 않은 유저 토큰입니다"));
  }
};

export default authMiddleware;
export { authAdminMiddleware, authBotMiddleware };
