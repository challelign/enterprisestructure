// import { ZodError } from "zod";

// import { AppError } from "../errors/app-error";

// import { errorResponse, successResponse } from "./api-response";

// export async function apiHandler(callback: () => Promise<any>) {
//   try {
//     const result = await callback();

//     return successResponse(result);
//   } catch (error: any) {
//     console.log("===============");
//     console.log("Constructor:", error?.constructor?.name);
//     console.log("Name:", error?.name);
//     console.log("InstanceOf AppError:", error instanceof AppError);
//     console.log("InstanceOf Error:", error instanceof Error);
//     console.log("StatusCode:", error?.statusCode);
//     console.log("Full Error:", error);
//     console.log("===============");
//     console.error(error);

//     if (error instanceof ZodError) {
//       return errorResponse("Validation failed", 422, error.flatten());
//     }

//     if (error instanceof AppError) {
//       return errorResponse(error.message, error.statusCode, error.errors);
//     }

//     return errorResponse("Internal Server Error", 500);
//   }
// }

import { ZodError } from "zod";
import { errorResponse, successResponse } from "./api-response";
import { ErrorLogger } from "../../core/logging/error-logger";

export async function apiHandler(callback: () => Promise<any>) {
  try {
    const result = await callback();

    return successResponse(result);
  } catch (error: any) {
    // console.error("API ERROR:", error);
    ErrorLogger.error("Unhandled API Error", error);
    // Zod validation
    if (error instanceof ZodError) {
      return errorResponse("Validation failed", 422, error.flatten());
    }

    // ✅ STRUCTURAL CHECK (THIS IS THE FIX)
    if (error && typeof error === "object" && "statusCode" in error) {
      return errorResponse(
        (error as any).message,
        (error as any).statusCode,
        (error as any).errors,
      );
    }

    // fallback
    return errorResponse("Internal Server Error", 500);
  }
}
