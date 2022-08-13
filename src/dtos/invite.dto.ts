import { IsEmail, IsString, MaxLength } from 'class-validator';

export class Invite {
    @IsString({message: "토큰 정보가 없습니다"})
    public token: string;
}

export class Email {
    @IsEmail({message: "이메일 형식으로 입력해주세요"})
    @IsString({message: "이메일 정보가 없습니다"})
    public email: string;
}

export class EmailVerify {
    @IsString({message: "토큰 정보가 없습니다"})
    public token: string;

    @IsString({message: "코드 정보가 없습니다"})
    public code: string;
}