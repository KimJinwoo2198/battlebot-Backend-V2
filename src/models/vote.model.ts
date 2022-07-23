import { model, Schema, Document } from 'mongoose';
import { Vote } from '@/interfaces/guild.interface';

const voteSchema: Schema = new Schema({
    guild_id: String,
    message_id: String,
    vote_items: [
      {
        item_id: String,
        item_name: String,
        vote: Number
      }
    ],
    status: String,
    published_date: { type: Date, default: Date.now },
});

const votesModel = model<Vote & Document>('votes', voteSchema, 'votes');

export default votesModel;
