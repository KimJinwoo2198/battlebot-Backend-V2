import { model, Schema, Document } from "mongoose";
import { VerifyPhone } from "@/interfaces/guild.interface";

const verifyPhoneSchema: Schema = new Schema({
  guild_id: String,
  user_id: String,
  token: String,
  status: String,
  phoneNumber: String,
  verfiyKey: String,
  published_date: { type: Date, default: Date.now },
});

const verifyPhoneModel = model<VerifyPhone & Document>("VerifyPhone", verifyPhoneSchema, "VerifyPhone");

export default verifyPhoneModel;
