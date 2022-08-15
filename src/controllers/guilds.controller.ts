import { NextFunction, Response } from 'express';
import ResponseWrapper from '@/utils/responseWrapper';
import GuildsService from '@/services/guilds.service';
import { RequestWithGuild } from '@/interfaces/guild.interface';

class GuildController {
  public guildsService = new GuildsService();

  public getGuild = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      ResponseWrapper(req, res, {data: await this.guildsService.getGuildData(req)})
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

  public getGuildPremium = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      ResponseWrapper(req, res, {data: req.isPremium})
    } catch (error) {
      next(error);
    }
  };

  public getGuildTickets = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tickets = await this.guildsService.getGuildTickets(req)
      ResponseWrapper(req, res, {data: tickets})
    } catch (error) {
      next(error);
    }
  };

  public getGuildVerifys = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      const verifys = await this.guildsService.getGuildVerifys(req)
      ResponseWrapper(req, res, {data: verifys})
    } catch (error) {
      next(error);
    }
  };

  public getGuildRoles = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roles = await this.guildsService.getGuildRoles(req)
      ResponseWrapper(req, res, {data: roles})
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

  public getCustomLink = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customlink = await this.guildsService.getGuildCustomLink(req)
      ResponseWrapper(req, res, {data: customlink})
    } catch (error) {
      next(error);
    }
  };

  public deleteCustomLink = async (req: RequestWithGuild, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customlink = await this.guildsService.deleteGuildCustomLink(req)
      ResponseWrapper(req, res, {data: customlink})
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
