import { PAYMENTS_TOSS_SECRET_KEY, PAYMENTS_TOSSPAYMENTS_SECRET_KEY } from "@/config";
import { RefreshToken } from "@/interfaces/payments.interface";
import { User } from "@/interfaces/users.interface";
import userModel from "@/models/users.model";
import axios, { AxiosResponse, Method } from "axios";

export const tossClient = async (
  method: Method = "GET",
  endpoints: string,
  data?: any,
  auth?: string | null,
): Promise<Response> => {
  try {
    const response: AxiosResponse = await axios({
      method,
      data,
      headers: {
        Authorization: auth ? "Bearer " + auth : "Basic " + Buffer.from(PAYMENTS_TOSS_SECRET_KEY + ":", "utf-8").toString("base64"),
      },
      url: "https://api.tosspayments.com" + endpoints,
      withCredentials: true,
    });
    return {
      data: response.data,
      error: false,
      status: 200,
      message: response.data.message,
    };
  } catch (response: any) {
    return {
      data: response.response.data,
      status: response.response.status,
      error: true,
      message: response.response.data.message,
    };
  }
};

export const tossPaymentsClient = async (
  method: Method = "GET",
  endpoints: string,
  data?: any,
  auth?: string | null,
): Promise<Response> => {
  try {
    const response: AxiosResponse = await axios({
      method,
      data,
      headers: {
        Authorization: auth ? "Bearer " + auth : "Basic " + Buffer.from(PAYMENTS_TOSSPAYMENTS_SECRET_KEY + ":", "utf-8").toString("base64"),
      },
      url: "https://api.tosspayments.com" + endpoints,
      withCredentials: true,
    });
    return {
      data: response.data,
      error: false,
      status: 200,
      message: response.data.message,
    };
  } catch (response: any) {
    return {
      data: response.response.data,
      status: response.response.status,
      error: true,
      message: response.response.data.message,
    };
  }
};

export const tossRefreshToken = async(user: User): Promise<RefreshToken> => {
  const refreshToken = await tossClient('POST', '/v1/brandpay/authorizations/access-token', {
    grantType: 'RefreshToken',
    refreshToken: user.toss_refreshToken,
    customerKey: user.id
  })
  if(refreshToken.error) {
    console.log(refreshToken.data)
    return null
  }
  await userModel.updateOne({id: user.id}, {$set: {toss_accessToken: refreshToken.data.accessToken, toss_refreshToken: refreshToken.data.refreshToken, toss_tokenType: refreshToken.data.tokenType}})
  return refreshToken.data
}

export interface Response {
  data?: any;
  error: boolean;
  status: number;
  message: string;
}
