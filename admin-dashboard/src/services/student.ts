// src/services/student.ts
import api from "./api";

// Get all students (admin only)
export const getStudents = async () => {
  const response = await api.get("/student");
  return response.data;
};

// Get a student by ID (admin or parent of the student)
export const getStudentById = async (studentId: string) => {
  const response = await api.get(`/student/${studentId}`);
  return response.data;
};

// Add a student (admin only)
export const addStudent = async (data: {
  firstName: string;
  lastName: string;
  level: string; // New field for level
  year: string; // New field for year
  parentEmail: string;
  stream?: string; // New field for stream (optional)
}) => {
  const response = await api.post("/student/add", data);
  return response.data;
};

// Update a student (admin or parent of the student)
export const updateStudent = async (
  studentId: string,
  data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    level?: string; // New field for level
    year?: string; // New field for year
    parentId?: string;
    stream?: string; // New field for stream (optional)
  }
) => {
  const response = await api.put(`/student/${studentId}`, data);
  return response.data;
};

// Delete a student (admin only)
export const deleteStudent = async (studentId: string) => {
  const response = await api.delete(`/student/${studentId}`);
  return response.data;
};
