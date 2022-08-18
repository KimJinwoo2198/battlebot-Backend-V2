import { Billings } from '@/interfaces/payments.interface';
import  { model, Schema, Document } from 'mongoose';

const billingsSchema: Schema = new Schema({
    itemId: String,
    target: String,
    type: String,
    targetType: String,
    method: String,
    paymentsType: String,
    useing: Boolean,
    userId: String,
    published_date: { type: Date, default: Date.now },
});

const billingsModel = model<Billings & Document>('billings', billingsSchema, 'billings');

export default billingsModel;
