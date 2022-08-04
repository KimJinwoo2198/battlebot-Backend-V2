export enum KAKAO_MESSAGE_TEMPLATE {
    VERIFY_MESSAGE = "KA01TP220804094445031E4Dmns6xHC1",
    PREMIUM_SUCCESS = "KA01TP2208040455502181EKxD1zSSxX"
}

export interface userSendData {
    lastSend: Date;
    sendCount: number
}