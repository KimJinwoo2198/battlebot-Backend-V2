import nodemailer from "nodemailer";
import { google } from "googleapis";
import {
  GOOGLE_MAIL_CLIENT_ID,
  GOOGLE_MAIL_EMAIL,
  GOOGLE_MAIL_REDIRECT_URL,
  GOOGLE_MAIL_REFRESH_TOKEN,
  GOOGLE_MAIL_SECRET_KEY,
} from "@/config";
import { HtmlTemplate } from "./htmlTemplate";

interface param {
  email: string;
  data: any;
  title:string
  template: string;
}

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_MAIL_CLIENT_ID,
  GOOGLE_MAIL_SECRET_KEY,
  GOOGLE_MAIL_REDIRECT_URL
);
oAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAIL_REFRESH_TOKEN,
});

const mailSender = {
  sendMail: async function (param: param) {
    try {
      const access_token = await oAuth2Client.getAccessToken();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "oauth2",
          user: GOOGLE_MAIL_EMAIL,
          clientId: GOOGLE_MAIL_CLIENT_ID,
          clientSecret: GOOGLE_MAIL_SECRET_KEY,
          refreshToken: GOOGLE_MAIL_REFRESH_TOKEN,
          accessToken: access_token as string,
        },
      });
      const mailOptions = {
        from: `"배틀이" <${GOOGLE_MAIL_EMAIL}>`,
        to: param.email,
        subject: param.title,
        html: await new HtmlTemplate().templateFromFile(param.template, param.data),
      };

      transporter.sendMail(mailOptions, function (error: any, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(info.response);
        }
      });
    } catch (e: any) {
      console.log(e);
      throw new Error(e.message);
    }
  },
};
export default mailSender;