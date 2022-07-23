import { RequestWithUser } from "./auth.interface";
import { Embed, Guild } from "discord.js";
import { Types as mongoTypes } from "mongoose"
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

export interface VoteItem {
  item_id: string;
  item_name: string
  vote: number;
}

export interface Vote {
  published_date: Date;
  guild_id: string;
  message_id: string;
  vote_items: VoteItem[];
  status: voteStatus
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
  messages: TicketMessage[]
}

export interface TicketMessage {
  author: object | string,
  created: Date,
  messages: string,
  embed: Embed
}



export type voteStatus = 'open' | 'close'