import { model, Schema, Document } from 'mongoose';
import { TicketSetting } from '@/interfaces/guild.interface';

const ticketSettingSchema: Schema = new Schema({
    guildId: String,
    categories: String,
    published_date: { type: Date, default: Date.now },
});

const ticketSettingModel = model<TicketSetting & Document>('ticketSetting', ticketSettingSchema, 'ticketSetting');

export default ticketSettingModel;
