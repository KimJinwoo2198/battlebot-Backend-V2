import { Router } from 'express';
import DiscordController from '@controllers/discord.controller';
import { Routes } from '@interfaces/routes.interface';

class DiscordRoute implements Routes {
  public path = '/discord';
  public router = Router();
  public discordController = new DiscordController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/caches`, this.discordController.caches);
  }
}

export default DiscordRoute;
