// src/types/teacher.ts
export interface Teacher {
  teacherId: string;
  userId: string;
  fisrtName: string;
  lastName: string;
  email: string;
  subjects: string[];
  approved: boolean;
  proofFile?: string;
}
