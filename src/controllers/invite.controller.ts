import { NextFunction, Request, Response } from 'express';
import ResponseWrapper from '@/utils/responseWrapper';
import { RequestWithGuild } from '@/interfaces/guild.interface';
import InviteService from '@/services/invite.service';
import { RequestWithUser } from '@/interfaces/auth.interface';

class InviteController {
  public inviteService = new InviteService();

  public getInvite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const invite = await this.inviteService.getInvite(req)
      ResponseWrapper(req, res, {data: invite})
    } catch (error) {
      next(error);
    }
  };

  public verifyEmail = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const invite = await this.inviteService.verifyEmail(req)
      ResponseWrapper(req, res, {data: invite})
    } catch (error) {
      next(error);
    }
  };

  public verifyEmailToken = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const invite = await this.inviteService.verifyEmailToken(req)
      ResponseWrapper(req, res, {data: invite})
    } catch (error) {
      next(error);
    }
  };


  public userInvite = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const invite = await this.inviteService.userInvite(req)
      ResponseWrapper(req, res, {data: invite})
    } catch (error) {
      next(error);
    }
  };
}

export default InviteController;
