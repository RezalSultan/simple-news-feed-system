import { handleAxiosError } from "@/lib/handle-axios-error";
import { AppResponse } from "@/type/app-response-type";
import { LoginResponse } from "@/type/auth-type";
import { FeedResponse, PostRequest } from "@/type/post-type";
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

export async function getFeed(
  page: number,
  limit: number,
  token?: string,
): Promise<AppResponse<FeedResponse>> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/feed?page=${page ?? 1}&limit=${limit ?? 1}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const payload = response.data;

    console.log(payload);

    return payload;
  } catch (err) {
    return handleAxiosError(err);
  }
}
