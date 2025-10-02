import { handleAxiosError } from "@/lib/handle-axios-error";
import { AppResponse } from "@/type/app-response-type";
import { RegisterRequest, RegisterResponse } from "@/type/auth-type";
import axios from "axios";

export async function register(
  req: RegisterRequest,
): Promise<AppResponse<RegisterResponse>> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/register`,
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

    return payload;
  } catch (err) {
    return handleAxiosError(err);
  }
}
