import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  _id: String,
  id: String,
  email: String,
  token: String,
  kakao_accessToken: String,
  kakao_refreshToken: String,
  google_accessToken: String,
  battlebot_flags: Number,
  google_refreshToken: String,
  kakao_email: String,
  kakao_name: String,
  kakao_id: String,
  tokenExp: Number,
  accessToken: String,
  refreshToken: String,
  expires_in: Number,
  minecraft_id: String,
  published_date: { type: Date, default: Date.now },
});

const userModel = model<User & Document>('userData', userSchema, 'userData');

export default userModel;
