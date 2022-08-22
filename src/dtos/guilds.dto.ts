import { Error } from "@/interfaces/error.interface";
import { automodEvents } from "@/interfaces/guild.interface";
import { ContainsEmoji } from "@/utils/customValidation";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsHexColor,
  IsIn,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Validate,
  ValidateNested,
} from "class-validator";

export class Embed {
  @IsString({ message: "제목을 입력해주세요" })
  public title: string;

  @IsOptional()
  @IsString({ message: "설명을 입력해주세요" })
  public description?: string;

  @IsOptional()
  @IsHexColor({ message: "올바른 색상을 선택해주세요" })
  public color?: string;
}

export class Button {
  @IsString({ message: "라벨을 입력해주세요" })
  @IsOptional()
  public label: string;
  @IsIn([1, 2, 3, 4, 5], { message: "올바른 색상을 선택해주세요" })
  @IsOptional()
  public color: string;
}

export class Vote {
  @IsArray({
    message: "투표 향목은 Array 형식이여야 합니다",
    context: { errorCode: Error.IS_NOT_ARRAY },
  })
  @ArrayMinSize(1, {
    message: "투표 향목을 최소 1가지 이상 입력해주세요",
    context: { errorCode: Error.IS_NOT_MIN_ARRAY },
  })
  @ArrayMaxSize(10, {
    message: "투표 향목은 최대 10가지 입니다",
    context: { errorCode: Error.IS_NOT_MAX_ARRAY },
  })
  public voteItems: string[];

  @IsString({
    message: "투표의 제목을 입력해주세요",
    context: { errorCode: Error.IS_NOT_TITLE },
  })
  public voteTitle: string;

  @IsString({
    message: "투표 채널을 선택해주세요",
    context: { errorCode: Error.IS_NOT_SELECT_CHANNEL },
  })
  public channel: string;
}

export class Verify {
  @IsIn(["phone", "email", "default"], {
    message: "올바른 방식의 인증방식을 선택해주세요",
  })
  public type: string;

  @IsString({
    message: "인증 채널을 선택해주세요",
    context: { errorCode: Error.IS_NOT_SELECT_CHANNEL },
  })
  public channel: string;
  @IsString({ message: "인증완료시 지급할 역할 선택해주세요" })
  public role: string;

  @IsOptional()
  @IsString({ message: "인증완료시 삭제할 역할 선택해주세요" })
  public deleteRole?: string;

  @IsDefined()
  @IsObject()
  @IsOptional()
  @ValidateNested()
  public button?: Button;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  public embed: Embed;
}

export class Warning {
  @IsString({
    message: "경고 사유를 입력해주세요",
    context: { errorCode: Error.IS_NOT_INPUT_REASON },
  })
  public reason: string;
}

export class CustomLink {
  @IsIn(["custom", "random"], {
    message: "올바른 커스텀 링크의 생성 타입을 입력해주세요",
    context: { errorCode: Error.IS_NOT_ALLOW_TYPE },
  })
  @IsString({
    message: "커스텀 링크의 생성 타입을 입력해주세요",
    context: { errorCode: Error.IS_NOT_SELECT_TYPE },
  })
  public type: string;

  @IsOptional()
  @IsIn(["kakao", "phone", "email"], {
    message: "올바른 커스텀 링크의 옵션 타입을 입력해주세요",
    context: { errorCode: Error.IS_NOT_ALLOW_TYPE },
  })
  @IsString({
    message: "커스텀 링크의 옵션 타입을 입력해주세요",
    context: { errorCode: Error.IS_NOT_SELECT_TYPE },
  })
  public option?: string;

  @IsOptional()
  @IsString({
    message: "커스텀 링크는 문자만 입력가능합니다",
    context: { errorCode: Error.IS_NOT_STRING },
  })
  public path?: string;
}

export class DeleteCustomLink {
  @IsArray({
    message: "삭제 향목은 Array 형식이여야 합니다",
    context: { errorCode: Error.IS_NOT_ARRAY },
  })
  public path: string[];
}

export class DeleteAutomod {
  @IsArray({
    message: "삭제 향목은 Array 형식이여야 합니다",
    context: { errorCode: Error.IS_NOT_ARRAY },
  })
  public id: string[];
}

export class Ticket {
  @IsString({
    message: "티켓 채널을 선택해주세요",
    context: { errorCode: Error.IS_NOT_SELECT_CHANNEL },
  })
  public channel: string;

  @IsString({
    message: "티켓이 생성될 카테고리를 선택해주세요",
    context: { errorCode: Error.IS_NOT_SELECT_CHANNEL },
  })
  public categori: string;
  @IsString({
    message: "티켓의 제목을 입력해주세요",
    context: { errorCode: Error.IS_NOT_TITLE },
  })
  public title: string;

  @IsString({
    message: "티켓의 설명을 입력해주세요",
    context: { errorCode: Error.IS_NOT_DESCRIPTION },
  })
  public description: string;

  @IsHexColor({ message: "임베드의 올바른 색상을 선택해 주세요" })
  @IsOptional()
  public color: string;

  @Validate(ContainsEmoji, {
    message: "임베드의 올바른 이모지를 선택해 주세요",
  })
  @IsOptional()
  public emoji: string;

  @IsString({ message: "버튼의 올바른 텍스트를 입력해 주세요" })
  @IsOptional()
  public button: string;
}

export class Automod {
  @IsIn(
    [
      "resetchannel",
      "blacklist_ban",
      "usercreateat",
      "usecurse",
      "uselink",
      "autorole",
    ],
    {
      message: "올바른 커스텀 링크의 생성 타입을 입력해주세요",
      context: { errorCode: Error.IS_NOT_ALLOW_TYPE },
    }
  )
  @IsString({
    message: "자동관리의 생성 타입을 입력해주세요",
    context: { errorCode: Error.IS_NOT_SELECT_TYPE },
  })
  public event: automodEvents;

  @IsOptional()
  @IsString({
    message: "실행할 이벤트는 문자만 입력가능합니다",
    context: { errorCode: Error.IS_NOT_STRING },
  })
  public start?: string;
}
