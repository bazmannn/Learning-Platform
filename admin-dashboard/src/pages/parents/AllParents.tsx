// src/pages/parents/AllParents.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getParents } from "../../services/parent";
import { useNavigate } from "react-router-dom";

interface Parent {
  parentId: string;
  userId: string;
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  address: string;
}

const AllParents = () => {
  const { t } = useTranslation("common");
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch parents when the component mounts
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const data = await getParents();
        setParents(data);
      } catch (err) {
        setError("Failed to fetch parents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Add a loading spinner or skeleton loader
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">{t("allParents")}</h1>

      {/* Parents Table */}
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
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {parents.map((parent) => (
              <tr
                key={parent.parentId}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {/* Parent Name */}
                <td className="px-2 py-2 text-sm text-gray-700 dark:text-white">
                  {parent.user.firstName} {parent.user.lastName}
                </td>

                {/* Parent Email */}
                <td className="px-2 py-2 text-sm text-gray-700 dark:text-white">
                  {parent.user.email}
                </td>

                {/* View Details Button */}
                <td className="px-2 py-2 text-sm text-gray-700 dark:text-white">
                  <button
                    onClick={() => navigate(`/parents/${parent.parentId}`)}
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

export default AllParents;
