// src/services/teacher.ts
import api from "./api";

// Get all teachers
export const getTeachers = async () => {
  const response = await api.get("/teacher"); // Updated to /teacher
  return response.data;
};

// Get a teacher by ID
export const getTeacherById = async (teacherId: string) => {
  const response = await api.get(`/teacher/${teacherId}`); // Updated to /teacher
  return response.data;
};

// Update teacher subjects
export const updateTeacherSubjects = async (
  teacherId: string,
  subjects: string[]
) => {
  const response = await api.put(`/teacher/${teacherId}/subjects`, {
    subjects,
  }); // Updated to /teacher
  return response.data;
};

// Add a teacher (admin only)
export const addTeacher = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  subjects: {
    name: string;
    level: "PRIMARY" | "MIDDLE" | "SECONDARY";
    year: "FIRST" | "SECOND" | "THIRD" | "FOURTH" | "FIFTH";
  }[];
}) => {
  const response = await api.post("/teacher/add", data);
  return response.data;
};

// Update teacher information
export const updateTeacher = async (
  teacherId: string,
  data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    subjects?: { name: string }[]; // Updated to match the new subject structure
    bio?: string;
  }
) => {
  const response = await api.put(`/teacher/${teacherId}/update`, data);
  return response.data;
};

// Approve a teacher (admin only)
export const approveTeacher = async (teacherId: string) => {
  const response = await api.put(`/teacher/${teacherId}/approve`);
  return response.data;
};

// Delete a teacher (admin only)
export const deleteTeacher = async (teacherId: string) => {
  const response = await api.delete(`/teacher/${teacherId}`); // Updated to /teacher
  return response.data;
};
