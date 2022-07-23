import { Error } from '@/interfaces/error.interface';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';

export class Vote {
    @IsArray({message: "투표 향목은 Array 형식이여야 합니다", context: { errorCode: Error.IS_NOT_ARRAY }})
    @ArrayMinSize(1, {message: "투표 향목을 최소 1가지 이상 입력해주세요", context: { errorCode: Error.IS_NOT_MIN_ARRAY }})
    @ArrayMaxSize(10, {message: "투표 향목은 최대 10가지 입니다", context: { errorCode: Error.IS_NOT_MAX_ARRAY }})
    public voteItems: string[]

    @IsString({message: "투표의 제목을 입력해주세요", context: { errorCode: Error.IS_NOT_TITLE }})
    public voteTitle: string

    @IsString({message: "투표 채널을 선택해주세요", context: { errorCode: Error.IS_NOT_SELECT_CHANNEL }})
    public channel: string;
}

export class Warning {

  @IsString({message: "경고 사유를 입력해주세요", context: { errorCode: Error.IS_NOT_INPUT_REASON }})
  public reason: string
}

export class CustomLink {
  @IsIn(["custom", "random"], {message: "올바른 커스텀 링크의 생성 타입을 입력해주세요", context: { errorCode: Error.IS_NOT_ALLOW_TYPE } })
  @IsString({message: "커스텀 링크의 생성 타입을 입력해주세요", context: { errorCode: Error.IS_NOT_SELECT_TYPE }})
  public type: string

  @IsOptional()
  @IsString({message: "커스텀 링크는 문자만 입력가능합니다", context: { errorCode: Error.IS_NOT_STRING }})
  public path?: string
}