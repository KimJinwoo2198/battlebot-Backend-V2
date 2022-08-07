import { SellItems } from '@/interfaces/payments.interface';
import  { model, Schema, Document } from 'mongoose';

const productsSchema: Schema = new Schema({
    itemId: String,
    amount: String,
    plan: String,
    itemName: String,
    itemDescription: String,
    itemFunctions: [String],
    type: String,
    published_date: { type: Date, default: Date.now },
});

const productsModel = model<SellItems & Document>('products', productsSchema, 'products');

export default productsModel;
