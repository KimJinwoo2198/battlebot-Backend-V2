import { RequestWithUser } from "./auth.interface";
import { Guild } from "discord.js";
export interface RequestWithGuild extends RequestWithUser {
  guild: Guild;
  isAdmin: Boolean;
  isPremium: Boolean
}
export interface premiumGuild {
  guild_id: string;
  nextpay_date: Date;
  published_date: Date;
}
