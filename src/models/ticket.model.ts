import mongoose, { model, Schema, Document } from 'mongoose';
import { Vote } from '@/interfaces/guild.interface';

const ticketSchema: Schema = new Schema({
    _id: mongoose.Types.ObjectId,
    status: String,
    guildId: String,
    userId: String,
    ticketId: String,
    messages: [
      {
        author: Object,
        created: Date,
        messages: String,
        embed: Object,
      },
    ],
    published_date: { type: Date, default: Date.now },
});

const ticketModel = model<Vote & Document>('ticket', ticketSchema, 'ticket');

export default ticketModel;
