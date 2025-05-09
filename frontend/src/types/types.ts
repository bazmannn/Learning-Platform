export interface ClassDetails {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  image: string;
  category: string;
  startDate: string;
  students: string;
  level: string;
}

export interface Course {
  topics: Topic[];
  courseId?: string;
  title: string;
  description?: string;
  isPublic: boolean;
  subjectId: string;
  image?: string;
}

// types.ts
export interface Topic {
  topicId: string | null | undefined;
  id: string;
  title: string;
  contents: Content[]; // Update this line
}

export interface Content {
  contentId: string;
  type: ContentType;
  data: string;
  topicId: string; // Ensure topicId is required
}

export enum ContentType {
  TEXT = "TEXT",
  LINK = "LINK",
  YOUTUBE_VIDEO = "YOUTUBE_VIDEO",
}

export enum Level {
  PRIMARY = "PRIMARY",
  MIDDLE = "MIDDLE",
  SECONDARY = "SECONDARY",
}

export enum Stream {
  SCIENCES = "SCIENCES",
  MATHEMATICS = "MATHEMATICS",
  LITERATURE = "LITERATURE",
  TECHNICAL = "TECHNICAL",
}

export enum Year {
  FIRST = "FIRST",
  SECOND = "SECOND",
  THIRD = "THIRD",
  FOURTH = "FOURTH",
  FIFTH = "FIFTH",
}

export interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  level: Level;
  year: Year;
  stream?: Stream | undefined;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  level: Level | "";
  year: Year | "";
  stream: Stream | undefined | "";
}
