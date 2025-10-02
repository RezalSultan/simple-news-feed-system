import { handleAxiosError } from "@/lib/handle-axios-error";
import { AppResponse } from "@/type/app-response-type";
import { LoginRequest, LoginResponse } from "@/type/auth-type";
import axios from "axios";
import Cookies from "js-cookie";

export async function login(
  req: LoginRequest,
): Promise<AppResponse<LoginResponse>> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/login`,
      req,
      {
        headers: {
          Accept: "application/json",
          // Authorization: `Bearer ${isLogin.token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const payload = response.data;
    Cookies.set("token", payload.data.token);
    Cookies.set("username", req.username);

    return payload;
  } catch (err) {
    return handleAxiosError(err);
  }
}
