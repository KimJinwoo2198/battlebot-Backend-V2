import { premiumUser } from "@/interfaces/guild.interface";
import { Document, model, Schema } from "mongoose";

const premiumUserSchema: Schema = new Schema({
    user_id: String,
    nextpay_date: { type: Date, default: Date.now },
    published_date: { type: Date, default: Date.now },
});

const premiumUserModel = model<premiumUser & Document>('premiumUser', premiumUserSchema, 'premiumUser');

export default premiumUserModel;
