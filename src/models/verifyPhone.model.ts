import { model, Schema, Document } from "mongoose";
import { VerifyPhone } from "@/interfaces/guild.interface";

const verifyPhoneSchema: Schema = new Schema({
  path: String,
  userId: String,
  token: String,
  code: String,
  status: String,
  phone: String,
  published_date: { type: Date, default: Date.now },
});

const verifyPhoneModel = model<VerifyPhone & Document>("verifyPhone", verifyPhoneSchema, "verifyPhone");

export default verifyPhoneModel;
