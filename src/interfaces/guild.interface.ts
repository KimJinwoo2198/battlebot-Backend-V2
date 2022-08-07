import { RequestWithUser } from "./auth.interface";
import { Embed, Guild } from "discord.js";
import { Types as mongoTypes } from "mongoose";
export interface RequestWithGuild extends RequestWithUser {
  guild: Guild;
  isAdmin: Boolean;
  isPremium: Boolean;
}
export interface premiumGuild {
  guild_id: string;
  nextpay_date: Date;
  published_date: Date;
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
  guild_id: String;
  user_id: String;
  token: String;
  status: String;
  published_date: Date;
}

export interface VerifyPhone {
  guild_id: String;
  user_id: String;
  token: String;
  status: String;
  phoneNumber: String;
  verfiyKey: String;
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
  useage: Number;
  type: "custom" | "random";
  published_date: Date;
}

export type voteStatus = "open" | "close";
