import { sign } from 'jsonwebtoken';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, SECRET_KEY, COOKIE_DOMAIN } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import axios from 'axios';

class AuthService {
  public users = userModel;

  public async login(code: string): Promise<string> {
    const formData = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: REDIRECT_URL,
    });
    const token = await axios
      .post('https://discord.com/api/oauth2/token', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .catch(error => {
        console.log(error.response.data);
        throw new HttpException(401, '유저 인증에 실패했습니다');
      });
    const user = await axios.get(`https://discord.com/api/users/@me`, {
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
    const findUser: User = await userModel.findOne({ id: user.data.id });
    if (!findUser) {
      const newUser = await userModel.findOneAndUpdate(
        { id: user.data.id },
        {
          $set: {
            _id: user.data.id,
            id: user.data.id,
            accessToken: user.data.access_token,
            refreshToken: user.data.refresh_token,
            email: user.data.email,
            expires_in: user.data.expires_in,
          },
        },
        { upsert: true, new: true },
      );
      return this.createCookie(this.createToken(newUser));
    } else {
      const updateUser = await userModel.findOneAndUpdate(
        { id: user.data.id },
        {
          accessToken: token.data.access_token,
          refreshToken: token.data.refresh_token,
          email: user.data.email,
        },
        { new: true },
      );
      return this.createCookie(this.createToken(updateUser));
    }
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id, accessToken: user.accessToken };
    const secretKey: string = SECRET_KEY;
    const expiresIn = 604800;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Domain=${COOKIE_DOMAIN}; Path=/;`;
  }
}

export default AuthService;
