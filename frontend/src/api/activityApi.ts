import type {
  ActivityPayload,
  AnalysisResult,
  StatusCalculationResponse,
} from "../types/activity";
import {
  API_BASE_URL,
  createAuthHeaders,
  getApiErrorMessage,
} from "./http";

export const calculateStatus = async (
  payload: ActivityPayload,
): Promise<StatusCalculationResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/status/calculate`,
    {
      method: "POST",
      headers: createAuthHeaders(true),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "ステータスの計算に失敗しました。",
      ),
    );
  }

  return (await response.json()) as StatusCalculationResponse;
};

export const analyzeActivity = async (
  payload: ActivityPayload,
): Promise<AnalysisResult> => {
  const response = await fetch(
    `${API_BASE_URL}/api/activity/analyze`,
    {
      method: "POST",
      headers: createAuthHeaders(true),
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "活動データの分析に失敗しました。",
      ),
    );
  }

  return (await response.json()) as AnalysisResult;
};