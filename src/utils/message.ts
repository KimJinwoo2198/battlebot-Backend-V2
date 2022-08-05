import {
  MESSAGE_API_KEY,
  MESSAGE_API_SECRET_KEY,
  MESSAGE_API_FROM,
  MESSAGE_API_PFID,
} from "@/config";
import {
  KAKAO_MESSAGE_TEMPLATE,
  userSendData,
} from "@/interfaces/message.interface";
import { SolapiMessageService } from "solapi";

const messageService = new SolapiMessageService(
  MESSAGE_API_KEY,
  MESSAGE_API_SECRET_KEY
);
const MessageSendUsers = new Map<string, userSendData>();
const sendMessage = async (
  to: string,
  templateId?: KAKAO_MESSAGE_TEMPLATE,
  variables?: Record<string, string>
) => {
  const messageRecode = MessageSendUsers.get(to);
  if (!messageRecode) {
    MessageSendUsers.set(to, {
      lastSend: new Date(),
      sendCount: 1,
    });
  } else {
    if (
      messageRecode.sendCount >= 2 &&
      (new Date().getTime() - messageRecode.lastSend.getTime()) /
        (60 * 60 * 1000) <=
        1
    ) {
      throw new Error("너무 많은 메시지를 보냈습니다 잠시후 다시 시도해주세요");
    } else {
      MessageSendUsers.set(to, {
        lastSend: new Date(),
        sendCount: messageRecode.sendCount + 1,
      });
    }
  }
  try {
    await messageService.sendOne({
      to,
      from: MESSAGE_API_FROM,
      kakaoOptions: {
        pfId: MESSAGE_API_PFID,
        templateId: templateId,
        disableSms: false,
        adFlag: false,
        variables,
      },
      autoTypeDetect: true,
    });
  } catch (e) {
    console.log(e);
    throw new Error("메시지 발송에 실패했습니다");
  }
};

export default sendMessage;
