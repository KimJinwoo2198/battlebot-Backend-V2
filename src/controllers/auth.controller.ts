import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { CLIENT_ID, REDIRECT_URL, COOKIE_DOMAIN, FRONT_REDIRECT_URL } from '@config';
import ResponseWrapper from '@/utils/responseWrapper';

class AuthController {
  public authService = new AuthService();
  private states = new Map<string, string>()
  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const code = req.query.code;
      if (!code) return res.redirect(`/auth/discord`);
      const cookie = await this.authService.login(code as string);
      const redirect = this.states.get(req.query.state as string)
      res.setHeader('Set-Cookie', [cookie]);
      res.redirect(`${FRONT_REDIRECT_URL}/${redirect ? redirect : ""}`);
    } catch (error) {
      next(error);
    }
  };

  public me = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      ResponseWrapper(req, res, {data: req.user})
    } catch (error) {
      next(error);
    }
  };

  public logInUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const redirect = req.query.redirect;
      const state = new Date().getTime().toString(36)
      if(redirect) this.states.set(state, redirect as string)
      res.redirect(
        `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code&scope=identify email guilds guilds.join&prompt=none&state=${state}`,
      );
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.setHeader('Set-Cookie', [`Authorization=; Max-age=0; domain=${COOKIE_DOMAIN}; path=/`]);
      res.redirect(`${FRONT_REDIRECT_URL}`);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
