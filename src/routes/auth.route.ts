import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/discord/callback`, this.authController.logIn);
    this.router.get(`${this.path}/me`, authMiddleware, this.authController.me);
    this.router.get(`${this.path}/discord`, this.authController.logInUrl);
    this.router.get(`${this.path}/logout`,authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
