// src/pages/subjects/AllSubjects.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getSubjectsByLevel } from "../../services/subject";
import { useNavigate } from "react-router-dom";

interface Subject {
  subjectId: string;
  name: string;
  level: "PRIMARY" | "MIDDLE" | "SECONDARY";
  stream: "SCIENCES" | "MATHEMATICS" | "LITERATURE" | "TECHNICAL" | null;
}

const AllSubjects = () => {
  const { t } = useTranslation("common");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjectsByLevel("SECONDARY"); // Default to secondary level
        setSubjects(data);
      } catch (err) {
        setError("Failed to fetch subjects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">{t("allSubjects")}</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                {t("name")}
              </th>
              <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                {t("level")}
              </th>
              <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                {t("stream")}
              </th>
              <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {subjects.map((subject) => (
              <tr
                key={subject.subjectId}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-2 py-2 text-sm text-gray-700 dark:text-white">
                  {subject.name}
                </td>
                <td className="px-2 py-2 text-sm text-gray-700 dark:text-white">
                  {subject.level}
                </td>
                <td className="px-2 py-2 text-sm text-gray-700 dark:text-white">
                  {subject.stream || "-"}
                </td>
                <td className="px-2 py-2 text-sm text-gray-700 dark:text-white">
                  <button
                    onClick={() => navigate(`/subjects/${subject.subjectId}`)}
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

export default AllSubjects;
