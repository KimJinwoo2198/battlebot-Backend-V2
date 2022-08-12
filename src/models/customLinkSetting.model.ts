import { model, Schema, Document } from 'mongoose';
import { CustomLinkSetting } from '@/interfaces/guild.interface';

const customLinkSettingSchema: Schema = new Schema({
    guild_id: String,
    path: String,
    useage: Number,
    type: String,
    option: String,
    published_date: { type: Date, default: Date.now },
});

const customLinkSettingModel = model<CustomLinkSetting & Document>('customLink', customLinkSettingSchema, 'customLink');

export default customLinkSettingModel;
