import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { authAdminMiddleware } from '@middlewares/auth.middleware';
import GuildController from '@/controllers/guilds.controller';
import validationMiddleware from '@middlewares/validation.middleware';
import { CustomLink, Ticket, Vote, Warning } from "@dtos/guilds.dto"

class GuildRoute implements Routes {
  public path = '/guilds';
  public router = Router();
  public guildsController = new GuildController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, authAdminMiddleware, this.guildsController.getGuild);
    this.router.get(`${this.path}/:id/members`, authAdminMiddleware, this.guildsController.getGuildMembers);
    this.router.get(`${this.path}/:id/members/:userId`, authAdminMiddleware, this.guildsController.getGuildMember);
    this.router.post(`${this.path}/:id/customlink`, authAdminMiddleware, validationMiddleware(CustomLink, 'body'), this.guildsController.setCustomLink);
    this.router.post(`${this.path}/:id/ticket/create`, authAdminMiddleware, validationMiddleware(Ticket, 'body'), this.guildsController.createTicket);
    this.router.post(`${this.path}/:id/members/:userId/warning`, authAdminMiddleware, validationMiddleware(Warning, 'body'), this.guildsController.addGuildMemberWarning);
    this.router.post(`${this.path}/:id/vote`, authAdminMiddleware, validationMiddleware(Vote, 'body'), this.guildsController.guildVote);
  }
}

export default GuildRoute;
