import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";

export class newPayments {
  @IsString()
  itemId: string;

  @IsOptional()
  @IsString({ message: "서버 아이디는 String형식 입니다" })
  guildId: string;
}

export class methodChange {
  @IsIn(["kakaopay", "tosspayments"], {
    message: "올바른 결제 타입을 입력해주세요",
  })
  paymentsType: string;

  @IsString({ message: "결제 방식는 String형식 입니다" })
  method: string;
}
export class autopay {
  @IsBoolean()
  status: boolean;
}

export class confirmPayment {
  @IsNumber()
  amount: number;

  @IsString()
  methodId: string;

  @IsString()
  orderId: string;

  @IsString()
  paymentKey: string;

  @Matches(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/g, {
    message: '"01012341234" 형식의 번호로 작성해주세요',
  })
  phone: string;

  @IsEmail()
  email: string;
}

export class PaymentsGift {
  @IsString()
  orderId: string;

  @IsString()
  amount: string;

  @IsString()
  paymentKey: string;

  @IsString()
  phone: string;
}

export class PaymentsKakaoPay {
  @IsString()
  orderId: string;

  @IsString()
  amount: string;

  @IsString()
  phone: string;
}

export class PaymentsKakaoPayApprove {
  @IsString()
  orderId: string;

  @IsString()
  pg_token: string;

  @IsString()
  phone: string;
}
