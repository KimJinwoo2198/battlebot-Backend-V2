import type { Types as mongoTypes} from "mongoose"

export interface PaymentsMethods {
  id: string;
  iconUrl: string;
  type: "account" | "card"
  accountName?: string;
  accountNumber?: string;
  bank?: string;
  bankCode?: string;
  cardName?: string;
  cardNumber?: string;
  cardType?: string;
  companyCode?: string
  select: boolean;
}

export interface RefreshToken {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
}

export interface SellItems {
    _id: mongoTypes.ObjectId;
    itemId: string;
    amount: string;
    itemName: string;
    itemDescription: string;
    plan: "month" | "year"
    itemFunctions: string[];
    type: "guild" | "user";
    published_date: Date;
  }
  
  export interface Payments {
    _id: mongoTypes.ObjectId;
    userId: string;
    orderId: string;
    item: string;
    phone: string;
    amount: string;
    process: "open" | "pending" | "success";
    secret: string;
    name: string;
    target: string;
    kakaoReadyPayments?: any;
    kakaoPayments?: any;
    payment?: payment;
  
    type: "guild" | "user";
  }
  
  export interface payment {
    mId: string;
    transactionKey: string;
    lastTransactionKey: string;
    paymentKey: string;
    orderId: string;
    orderName: string;
    status: string;
    requestedAt: Date;
    approvedAt: Date;
    useEscrow: boolean;
    cultureExpense: boolean;
    card?: Card;
    virtualAccount?: virtualAccount;
    transfer: Transfer;
    mobilePhone?: string;
    giftCertificate?: giftCertificate;
    cashReceipt?: cashReceipt;
    discount?: discount;
    cancels?: cancels[];
    secret: string;
    type: string;
    easyPay?: easyPay;
    country: string;
    failure?: any;
    isPartialCancelable: boolean;
    receipt: Receipt;
    currency: string;
    totalAmount: number;
    balanceAmount: number;
    suppliedAmount: number;
    vat: number;
    taxFreeAmount: number;
    method: string;
    version: string;
  }
  
  export interface easyPay {
    amount: number;
    provider: string;
    discountAmount: number;
  }
  
  export interface cancels {
    cancelAmount: number;
    cancelReason: string;
    taxFreeAmount: number;
    taxAmount?:number;
    refundableAmount: number;
    canceledAt: Date;
    transactionKey: string;
  }
  
  export interface discount {
    amount: number
  }
  
  export interface cashReceipt {
    type: string;
    registrationNumber: string;
    businessNumber: string;
  }
  
  export interface giftCertificate {
    approveNo: string;
    settlementStatus: string;
  }
  
  export interface Receipt {
    url: string;
  }
  
  export interface Card {
    company: string;
    number: string;
    cardType: string;
    ownerType: string;
  }
  
  export interface Transfer {
    bank: string;
    settlementStatus: string;
  }
  
  export interface virtualAccount {
    accountNumber: string;
    accountType: string;
    bank: string;
    customerName: string;
    dueDate: Date;
    expired: boolean;
    settlementStatus: string;
    refundStatus: string;
  }