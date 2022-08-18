import { TossMethods } from '@/interfaces/payments.interface';
import  { model, Schema, Document } from 'mongoose';

const tossmethodsSchema: Schema = new Schema({
    userId: String,
    methodId: String,
    methodKey: String,
    published_date: { type: Date, default: Date.now },
});

const paymentsTossMethodsModel = model<TossMethods & Document>('paymentsTossMethods', tossmethodsSchema, 'paymentsTossMethods');

export default paymentsTossMethodsModel;
