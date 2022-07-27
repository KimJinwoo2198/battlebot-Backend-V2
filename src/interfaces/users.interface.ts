import { User as DiscordUser } from "discord.js"

export interface User {
  discordAccessToken: any;
  _id: string;
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  battlebot_flags: number;
  kakao_accessToken?: string;
  kakao_refreshToken?: string;
  kakao_id?: string;
  kakao_email?: string;
  kakao_name?: string;
  google_accessToken?: string;
  google_refreshToken?: string;
  token: string;
  tokenExp: number;
  expires_in: number;
  published_date: Date;
  minecraft_id?: string;
  user: DiscordUser
}

export enum BattlebotUserFlags {
	general = 0 << 0,
	admin = 1 << 10
}
