import { AppErrorResponse } from "@/type/app-response-type";
import { AxiosError } from "axios";

export function handleAxiosError(err: unknown): AppErrorResponse {
  const error = err as AxiosError<AppErrorResponse>;

  return (
    error.response?.data ?? {
      statusCode: 500,
      status: "error",
      errors: {
        message: "Something went wrong",
      },
    }
  );
}
