import { model, Schema, Document } from "mongoose";
import { VerifyEmail } from "@/interfaces/guild.interface";

const verifyEmailSchema: Schema = new Schema({
  path: String,
  userId: String,
  token: String,
  code: String,
  status: String,
  published_date: { type: Date, default: Date.now },
});

const verifyEmailModel = model<VerifyEmail & Document>("verifyEmail", verifyEmailSchema, "verifyEmail");

export default verifyEmailModel;
