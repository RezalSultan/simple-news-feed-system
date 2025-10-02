import { handleAxiosError } from "@/lib/handle-axios-error";
import { AppResponse } from "@/type/app-response-type";
import { LoginResponse } from "@/type/auth-type";
import { PostRequest } from "@/type/post-type";
import axios from "axios";

export async function post(
  req: PostRequest,
  token?: string,
): Promise<AppResponse<LoginResponse>> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/posts`,
      req,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
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
