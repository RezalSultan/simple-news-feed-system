import { handleAxiosError } from "@/lib/handle-axios-error";
import { AppResponse } from "@/type/app-response-type";
import { FeedResponse } from "@/type/post-type";
import axios from "axios";

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

    return payload;
  } catch (err) {
    return handleAxiosError(err);
  }
}
