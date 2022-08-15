import { model, Schema, Document } from 'mongoose';
import { Log } from '@/interfaces/logger.interface';

const loggerSchema: Schema = new Schema({
  path: String,
  requestId: String,
  method: String,
  error: Object,
  request: String,
  requestBody: Object,
  requestHeders: Object,
  requestCookies: Object,
  ip: String,
  published_date: { type: Date, default: Date.now },
});

const loggerModel = model<Log & Document>('logger', loggerSchema, 'logger');
loggerModel.schema.index({published_date: 1}, { expireAfterSeconds: 604800 });
export default loggerModel;
