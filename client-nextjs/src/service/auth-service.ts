import { handleAxiosError } from "@/lib/handle-axios-error";
import { AppResponse } from "@/type/app-response-type";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/type/auth-type";
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
          "Content-Type": "application/json",
        },
      },
    );
    const payload = response.data;
    console.log(payload);
    Cookies.set("token", payload.data.token, {
      path: "/", // penting supaya bisa diakses di semua route
      sameSite: "lax", // 'lax' aman untuk http
      secure: false, // false karena belum pakai https
    });

    Cookies.set("refresh_token", payload.data.refresh_token, {
      path: "/",
      sameSite: "lax",
      secure: false,
    });

    Cookies.set("username", req.username, {
      path: "/",
      sameSite: "lax",
      secure: false,
    });

    return payload;
  } catch (err) {
    return handleAxiosError(err);
  }
}

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
    Cookies.remove("refresh_token");
    Cookies.remove("username");

    return payload;
  } catch (err) {
    return handleAxiosError(err);
  }
}

export async function verifyToken(accessToken: string) {
  return axios.get(`${process.env.API_URL}/verify-token`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
}

export async function refreshAccessToken(refreshToken: string) {
  return axios.get(`${process.env.API_URL}/generate-access-token`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    },
  });
}
