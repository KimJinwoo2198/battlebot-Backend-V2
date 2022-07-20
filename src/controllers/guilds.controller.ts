import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { CLIENT_ID, REDIRECT_URL, COOKIE_DOMAIN, FRONT_REDIRECT_URL } from '@config';
import ResponseWrapper from '@/utils/responseWrapper';
import GuildsService from '@/services/guilds.service';
import { RequestWithGuild } from '@/interfaces/guild.interface';

class GuildController {
  public guildsService = new GuildsService();

  public getGuild = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      ResponseWrapper(req, res, {data: this.guildsService.getGuildData(req)})
    } catch (error) {
      next(error);
    }
  };
}

export default GuildController;
