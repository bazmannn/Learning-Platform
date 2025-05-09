// src/services/parent.ts
import api from "./api";

// Get all parents
export const getParents = async () => {
  const response = await api.get("/parent");
  return response.data;
};

// Get a parent by ID
export const getParentById = async (parentId: string) => {
  const response = await api.get(`/parent/${parentId}`);
  return response.data;
};

// Add a parent
export const addParent = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
}) => {
  const response = await api.post("/parent/add", data);
  return response.data;
};

// Edit a parent
export const editParent = async (
  parentId: string,
  data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
  }
) => {
  const response = await api.put(`/parent/${parentId}`, data);
  return response.data;
};

// Delete a parent (admin only)
export const deleteParent = async (parentId: string) => {
  const response = await api.delete(`/parent/${parentId}`);
  return response.data;
};

// Enroll a student in a course
export const enrollStudentToCourse = async (data: {
  parentId: string;
  studentId: string;
  courseId: string;
}) => {
  const response = await api.post("/parent/enroll", data);
  return response.data;
};

// Unenroll a student from a course
export const unenrollStudentFromCourse = async (data: {
  parentId: string;
  studentId: string;
  courseId: string;
}) => {
  const response = await api.post("/parent/unenroll", data);
  return response.data;
};
