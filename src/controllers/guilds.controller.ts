import { NextFunction, Request, Response } from 'express';
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

  public getGuildMembers = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      const members = await this.guildsService.getGuildMembers(req)
      ResponseWrapper(req, res, {data: members})
    } catch (error) {
      next(error);
    }
  };

  public getGuildMember = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      const member = await this.guildsService.getGuildMember(req)
      ResponseWrapper(req, res, {data: member})
    } catch (error) {
      next(error);
    }
  };

  public setCustomLink = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customlink = await this.guildsService.setGuildCustomLink(req)
      ResponseWrapper(req, res, customlink)
    } catch (error) {
      next(error);
    }
  };

  public createTicket = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createTicket = await this.guildsService.createTicket(req)
      ResponseWrapper(req, res, {message: createTicket})
    } catch (error) {
      next(error);
    }
  };

  public addGuildMemberWarning = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      const memberWarning = await this.guildsService.addGuildMemberWarning(req)
      ResponseWrapper(req, res, {data: memberWarning})
    } catch (error) {
      next(error);
    }
  };

  public guildVote = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      const voteSettingResult = await this.guildsService.voteData(req)
      ResponseWrapper(req, res, {message: voteSettingResult})
    } catch (error) {
      next(error);
    }
  };
}

export default GuildController;
