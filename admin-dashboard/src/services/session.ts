// src/services/session.ts
import api from "./api";

export const getSessions = async () => {
  const response = await api.get("/sessions");
  return response.data;
};

export const deleteSession = async (sessionId: string) => {
  const response = await api.delete(`/sessions/${sessionId}`);
  return response.data;
};
