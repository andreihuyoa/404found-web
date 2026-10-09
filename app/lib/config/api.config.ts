function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export const API_CONFIG = {
  MODEL_BASE_URL: normalizeBaseUrl(
    process.env.NEXT_PUBLIC_MODEL_BASE_API_URL ||
      "https://four04found-model.onrender.com",
  ),
} as const;
