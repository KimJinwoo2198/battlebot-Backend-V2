import DiscordService from '@/services/discord.service';
import ResponseWrapper from '@/utils/responseWrapper';
import { NextFunction, Request, Response } from 'express';

class DiscordController {
  public discordService = new DiscordService();

  public caches = (req: Request, res: Response, next: NextFunction) => {
    try {
      ResponseWrapper(req, res, {data: this.discordService.getCachesData(req)})
    } catch (error) {
      next(error);
    }
  };
}

export default DiscordController;
