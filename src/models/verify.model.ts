import { model, Schema, Document } from "mongoose";
import { Verify } from "@/interfaces/guild.interface";

const verifySchema: Schema = new Schema({
  guild_id: String,
  user_id: String,
  token: String,
  status: String,
  published_date: { type: Date, default: Date.now },
});

const verifyModel = model<Verify & Document>("Verify", verifySchema, "Verify");

export default verifyModel;
