import { handleAxiosError } from "@/lib/handle-axios-error";
import { AppResponse } from "@/type/app-response-type";
import { User } from "@/type/user-type";
import axios from "axios";

export async function getSuggestUser(
  token?: string,
): Promise<AppResponse<User[]>> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/suggest-users`,
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
