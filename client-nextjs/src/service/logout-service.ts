import { handleAxiosError } from "@/lib/handle-axios-error";
import { AppResponse } from "@/type/app-response-type";
import axios from "axios";
import Cookies from "js-cookie";

export async function logout(token?: string): Promise<AppResponse<void>> {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/logout`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const payload = response.data;
    Cookies.remove("token");
    Cookies.remove("username");

    return payload;
  } catch (err) {
    return handleAxiosError(err);
  }
}
