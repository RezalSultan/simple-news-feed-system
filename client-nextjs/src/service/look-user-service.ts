import { handleAxiosError } from "@/lib/handle-axios-error";
import { AppResponse } from "@/type/app-response-type";
import { AllInfoUser } from "@/type/user-type";
import axios from "axios";

export async function lookUser(
  username: string,
  token?: string,
): Promise<AppResponse<AllInfoUser>> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/other-user/${username}`,
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
