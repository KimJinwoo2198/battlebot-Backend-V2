import mongoose, { model, Schema, Document } from 'mongoose';
import { Warning } from '@/interfaces/guild.interface';

const warningSchema: Schema = new Schema({
    reason: String,
    guildId: String,
    userId: String,
    managerId: String,
    published_date: { type: Date, default: Date.now },
});

const warningModel = model<Warning & Document>('warning', warningSchema, 'warning');

export default warningModel;
