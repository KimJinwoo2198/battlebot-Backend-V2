import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware, { authAdminMiddleware } from '@middlewares/auth.middleware';
import GuildController from '@/controllers/guilds.controller';

class GuildRoute implements Routes {
  public path = '/guilds';
  public router = Router();
  public guildsController = new GuildController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, authAdminMiddleware, this.guildsController.getGuild);
  }
}

export default GuildRoute;
