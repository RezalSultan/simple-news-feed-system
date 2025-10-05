import { handleAxiosError } from "@/lib/handle-axios-error";
import { AppResponse } from "@/type/app-response-type";
import { AllInfoUser, User } from "@/type/user-type";
import axios from "axios";

export async function getProfile(
  token?: string,
): Promise<AppResponse<AllInfoUser>> {
  try {
    const response = await axios.get(`${process.env.API_URL}/data-user`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const payload = response.data;

    return payload;
  } catch (err) {
    return handleAxiosError(err);
  }
}

export async function lookUser(
  username: string,
  token?: string,
): Promise<AppResponse<AllInfoUser>> {
  try {
    const response = await axios.get(
      `${process.env.API_URL}/other-user/${username}`,
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

export async function getSuggestUser(
  token?: string,
): Promise<AppResponse<User[]>> {
  try {
    const response = await axios.get(`${process.env.API_URL}/suggest-users`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const payload = response.data;

    return payload;
  } catch (err) {
    return handleAxiosError(err);
  }
}

export async function getAllUser(token?: string): Promise<AppResponse<User[]>> {
  try {
    const response = await axios.get(`${process.env.API_URL}/all-users`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const payload = response.data;

    return payload;
  } catch (err) {
    return handleAxiosError(err);
  }
}
