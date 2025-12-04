import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "../../lib/api/recommendation.api";
import {
  validateRecommendationRequest,
  normalizeRecommendationRequest,
} from "../../lib/utils/validation";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          code: "INVALID_JSON",
        },
        { status: 400 }
      );
    }

    // Validate request
    const validation = validateRecommendationRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: validation.error,
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    // Normalize and execute API call
    const requestBody = body as Record<string, unknown>;
    const recommendationRequest = normalizeRecommendationRequest(requestBody);
    const result = await getRecommendations(recommendationRequest);

    // Return success response
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // Handle API errors
    const apiError = error as Error & { statusCode?: number };
    const statusCode = apiError.statusCode || 500;

    console.error("Error in /api/recommend:", error);

    return NextResponse.json(
      {
        error: apiError.message || "Internal server error",
        code: statusCode >= 500 ? "INTERNAL_ERROR" : "API_ERROR",
      },
      { status: statusCode }
    );
  }
}
