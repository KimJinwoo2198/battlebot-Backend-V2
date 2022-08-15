import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import InviteController from '@/controllers/invite.controller';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Email, EmailVerify, Invite, Phone, PhoneVerify } from '@/dtos/invite.dto';
import { verifyPhoneRateLimit } from '@/middlewares/rateLimit.middleware';

class InviteRoute implements Routes {
  public path = '/invite';
  public router = Router();
  public inviteController = new InviteController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.inviteController.getInvite);
    this.router.post(`${this.path}/:id`, authMiddleware, validationMiddleware(Invite, "body"), this.inviteController.userInvite);
    this.router.post(`${this.path}/:id/phone`, verifyPhoneRateLimit, authMiddleware, validationMiddleware(Phone, 'body'), this.inviteController.guildVerifyPhone);
    this.router.post(`${this.path}/:id/phone/verify`, authMiddleware, validationMiddleware(PhoneVerify, "body"), this.inviteController.verifyPhoneToken);
    this.router.post(`${this.path}/:id/email`, authMiddleware, validationMiddleware(Email, "body"), this.inviteController.verifyEmail);
    this.router.post(`${this.path}/:id/email/verify`, authMiddleware, validationMiddleware(EmailVerify, "body"), this.inviteController.verifyEmailToken);
  }
}

export default InviteRoute;
