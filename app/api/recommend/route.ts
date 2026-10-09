import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "../../lib/api/recommendations";
import {
  validateRecommendationRequest,
  normalizeRecommendationRequest,
} from "../../lib/utils/validation";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          code: "INVALID_JSON",
        },
        { status: 400 },
      );
    }

    const validation = validateRecommendationRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: validation.error,
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    const requestBody = body as Record<string, unknown>;
    const recommendationRequest = normalizeRecommendationRequest(requestBody);
    const result = await getRecommendations(recommendationRequest);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const apiError = error as Error & { statusCode?: number };
    const statusCode = apiError.statusCode || 500;

    console.error("Error in /csrp/recommend:", error);

    return NextResponse.json(
      {
        error: apiError.message || "Internal server error",
        code: statusCode >= 500 ? "INTERNAL_ERROR" : "API_ERROR",
      },
      { status: statusCode },
    );
  }
}
