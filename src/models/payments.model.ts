import { Payments } from '@/interfaces/payments.interface';
import  { model, Schema, Document } from 'mongoose';

const paymentsSchema: Schema = new Schema({
    userId: String,
    orderId: String,
    amount: String,
    process: String,
    secret: String,
    name: String,
    phone: String,
    target: String,
    type: String,
    payment: Object,
    kakaoReadyPayments: Object,
    kakaoPayments: Object,
    item: String,
    published_date: { type: Date, default: Date.now },
});

const paymentsModel = model<Payments & Document>('payments', paymentsSchema, 'payments');

export default paymentsModel;
