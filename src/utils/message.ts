import { MESSAGE_API_KEY, MESSAGE_API_SECRET_KEY,MESSAGE_API_SECRET_KEY_FROM } from "@/config"
import { SolapiMessageService } from "solapi"

const messageService = new SolapiMessageService(MESSAGE_API_KEY, MESSAGE_API_SECRET_KEY)

const sendMessage = async(to: string, { from = MESSAGE_API_SECRET_KEY_FROM, text = undefined}) => {
    if(!text) throw new Error("보낼 메시지는 필수로 입력이 필요합니다")
    try {
        await messageService.sendOne({
            to,
            text,
            from,
            autoTypeDetect: true
        })
    } catch(e) {
        throw new Error("메시지 발송에 실패했습니다");
    }
}

export default sendMessage;