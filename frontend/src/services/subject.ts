// src/services/subject.ts
import api from "./api";

// Add a subject (admin only)
export const addSubject = async (data: {
  name: string;
  level: "PRIMARY" | "MIDDLE" | "SECONDARY";
  stream?: "SCIENCES" | "MATHEMATICS" | "LITERATURE" | "TECHNICAL";
  year: "FIRST" | "SECOND" | "THIRD" | "FOURTH" | "FIFTH"; // Add this
}) => {
  const response = await api.post("/subject", data);
  return response.data;
};

// Get subjects by level (public)
export const getSubjectsByLevel = async (level: string) => {
  const response = await api.get(`/subject/level/${level}`);
  return response.data;
};

// Get subjects by stream (for secondary level)
export const getSubjectsByStream = async (stream: string) => {
  const response = await api.get(`/subject/stream/${stream}`);
  return response.data;
};

// Delete a subject (admin only)
export const deleteSubject = async (subjectId: string) => {
  const response = await api.delete(`/subject/${subjectId}`);
  return response.data;
};
