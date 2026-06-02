import { NextResponse } from "next/server";

export function successResponse<T>(
  data?: T,
  message = "Success",
  status = 200,
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    {
      status,
    },
  );
}

export function errorResponse(message: string, status = 500, errors?: unknown) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    },
    {
      status,
    },
  );
}
