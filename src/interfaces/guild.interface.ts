import { RequestWithUser } from "./auth.interface";
import { Embed, Guild } from "discord.js";
import { Types as mongoTypes } from "mongoose";
export interface RequestWithGuild extends RequestWithUser {
  guild: Guild;
  isAdmin: boolean;
  isPremium: boolean;
}
export interface premiumGuild {
  guild_id: string;
  nextpay_date: Date;
  published_date: Date;
}

export interface automod {
  guildId: string;
  event: automodEvents;
  start: string;
}

export interface premiumUser {
  user_id: string;
  nextpay_date: Date;
  published_date: Date;
}

export interface VoteItem {
  item_id: string;
  item_name: string;
  vote: number;
}

export interface Vote {
  published_date: Date;
  guild_id: string;
  message_id: string;
  vote_items: VoteItem[];
  status: voteStatus;
}

export interface Verify {
  guild_id: string;
  user_id: string;
  token: string;
  status: string;
  published_date: Date;
}

export interface VerifyEmail {
  path: string;
  userId: string;
  token: string;
  code: string;
  status: "open" | "success";
  published_date: Date;
}

export interface VerifyPhone {
  path: string;
  userId: string;
  token: string;
  code: string;
  status: "open" | "success";
  phone: string;
  published_date: Date;
}

export interface Warning {
  _id: string;
  userId: string;
  guildId: string;
  reason: string;
  managerId: string;
  published_date: Date;
}

export interface Ticket {
  _id: mongoTypes.ObjectId;
  status: string;
  guildId: string;
  userId: string;
  ticketId: string;
  published_date?: Date;
  messages: TicketMessage[];
}

export interface TicketMessage {
  author: object | string;
  created: Date;
  messages: string;
  embed: Embed;
}

export interface TicketSetting {
  _id: mongoTypes.ObjectId;
  categories: string;
  guildId: string;
  published_date: Date;
}

export interface CustomLinkSetting {
  guild_id: string;
  path: string;
  useage: number;
  type: "custom" | "random";
  option: "kakao" | "phone" | "email";
  published_date: Date;
}

export type voteStatus = "open" | "close";
export type automodEvents = "resetchannel" | "blacklist_ban" | "usercreateat" | "usecurse" | "uselink" | "autorole"
