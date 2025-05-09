// src/pages/students/StudentDetails.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import {
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../../services/student";

interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  className: string;
  parentId: string;
  parent: {
    parentId: string;
    userId: string;
    user: {
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
  grades: {
    gradeId: string;
    score: number;
    quiz: {
      quizId: string;
      title: string;
    };
    exam: {
      examId: string;
      title: string;
    };
    course: {
      courseId: string;
      title: string;
    };
  }[];
}

const StudentDetails = () => {
  const { t } = useTranslation("common");
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    className: "",
    parentId: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (!studentId) {
          throw new Error("Student ID is missing");
        }
        const data = await getStudentById(studentId);
        setStudent(data);
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          className: data.className,
          parentId: data.parentId,
        });
      } catch (err) {
        console.error("Error fetching student details:", err);
        setError("Failed to fetch student details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!studentId) {
      alert("Student ID is missing");
      return;
    }

    try {
      await updateStudent(studentId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        className: formData.className,
        parentId: formData.parentId,
      });
      alert("Student updated successfully!");
      setEditMode(false);
    } catch (err) {
      alert("Failed to update student. Please try again.");
    }
  };

  const handleDeleteStudent = async () => {
    if (!studentId) {
      alert("Student ID is missing");
      return;
    }

    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(studentId);
        alert("Student deleted successfully!");
        navigate("/admin/students");
      } catch (err) {
        alert("Failed to delete student. Please try again.");
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!student) {
    return <p>Student not found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">{t("studentDetails")}</h1>

      {editMode ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("firstName")}
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("lastName")}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("className")}
            </label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("parentId")}
            </label>
            <input
              type="text"
              name="parentId"
              value={formData.parentId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              {t("save")}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {student.firstName} {student.lastName}
          </h2>
          <p className="text-gray-700 dark:text-white mb-4">
            <strong>{t("className")}:</strong> {student.className}
          </p>
          <p className="text-gray-700 dark:text-white mb-4">
            <strong>{t("parentId")}:</strong> {student.parentId}
          </p>
          <p className="text-gray-700 dark:text-white mb-4">
            <strong>{t("parent")}:</strong> {student.parent.user.firstName}{" "}
            {student.parent.user.lastName}
          </p>
          <p className="text-gray-700 dark:text-white mb-4">
            <strong>{t("parentEmail")}:</strong> {student.parent.user.email}
          </p>
          <div className="mb-4">
            <strong>{t("grades")}:</strong>
            <ul className="list-disc list-inside">
              {student.grades.map((grade) => (
                <li key={grade.gradeId}>
                  <p>Course: {grade.course.title}</p>
                  <p>Quiz: {grade.quiz.title}</p>
                  <p>Exam: {grade.exam.title}</p>
                  <p>Score: {grade.score}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t("edit")}
            </button>
            <button
              onClick={handleDeleteStudent}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              {t("delete")}
            </button>
            <button
              onClick={() => navigate("/admin/students")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {t("back")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;
