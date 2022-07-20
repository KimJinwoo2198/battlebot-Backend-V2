import { premiumGuild } from "@/interfaces/guild.interface";
import { Document, model, Schema } from "mongoose";

const premiumGuildSchema: Schema = new Schema({
    guild_id: String,
    nextpay_date: { type: Date, default: Date.now },
    published_date: { type: Date, default: Date.now },
});

const premiumGuildModel = model<premiumGuild & Document>('premiumGuild', premiumGuildSchema, 'premiumGuild');

export default premiumGuildModel;
