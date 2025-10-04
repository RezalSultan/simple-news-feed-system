import { handleAxiosError } from "@/lib/handle-axios-error";
import { AppResponse } from "@/type/app-response-type";
import axios from "axios";

export async function followUser(
  userId: bigint,
  token?: string,
): Promise<AppResponse<void>> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/follow/${userId}`,
      {},
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

export async function unfollowUser(
  userId: bigint,
  token?: string,
): Promise<AppResponse<void>> {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/follow/${userId}`,
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
