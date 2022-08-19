import { automod } from "@/interfaces/guild.interface";
import { Document, model, Schema } from "mongoose";

const automodSchema: Schema = new Schema({
    guildId: String,
    event: String,
    start: String,
    published_date: { type: Date, default: Date.now },
});

const automodModel = model<automod & Document>('automod', automodSchema, 'automod');

export default automodModel;
