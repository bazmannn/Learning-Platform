// src/pages/students/AllStudents.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getStudents } from "../../services/student";
import { useNavigate } from "react-router-dom";

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

const AllStudents = () => {
  const { t } = useTranslation("common");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (err) {
        setError("Failed to fetch students. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">{t("allStudents")}</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                {t("name")}
              </th>
              <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                {t("email")}
              </th>
              <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                {t("parent")}
              </th>
              <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                {t("grade")}
              </th>
              <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {students.map((student) => (
              <tr
                key={student.studentId}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-2 py-2 text-sm text-gray-700 dark:text-white">
                  {student.firstName} {student.lastName}
                </td>
                <td className="px-2 py-2 text-sm text-gray-700 dark:text-white">
                  {student.parent.user.email}
                </td>
                <td className="px-2 py-2 text-sm text-gray-700 dark:text-white">
                  {student.parent.user.firstName} {student.parent.user.lastName}
                </td>
                <td className="px-2 py-2 text-sm text-gray-700 dark:text-white">
                  {student.grades.map((grade) => (
                    <div key={grade.gradeId}>
                      <p>Course: {grade.course.title}</p>
                      <p>Quiz: {grade.quiz.title}</p>
                      <p>Exam: {grade.exam.title}</p>
                      <p>Score: {grade.score}</p>
                    </div>
                  ))}
                </td>
                <td className="px-2 py-2 text-sm text-gray-700 dark:text-white">
                  <button
                    onClick={() => navigate(`/students/${student.studentId}`)}
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    {t("viewDetails")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllStudents;
