import { IsEmail, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class newPayments {
  @IsString()
  itemId: string;

  @IsOptional()
  @IsString({message: "서버 아이디는 String형식 입니다"})
  guildId: string
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
    message: "\"01012341234\" 형식의 번호로 작성해주세요"
  })
  phone: string;

  @IsEmail()
  email: string;
}