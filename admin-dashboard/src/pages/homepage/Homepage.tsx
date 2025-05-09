import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getTeachers } from "../../services/teacher"; // Import the getTeachers function

const Homepage = () => {
  const { t } = useTranslation("homepage");
  const [totalTeachers, setTotalTeachers] = useState(0); // State for total teachers

  // Fetch teachers when the component mounts
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachers = await getTeachers(); // Fetch teachers from the backend
        setTotalTeachers(teachers.length); // Update the total teachers count
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">{t("welcome")}</h1>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Teachers Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">{t("totalTeachers")}</h2>
          <p className="text-3xl font-bold text-blue-500">
            {totalTeachers}
          </p>{" "}
          {/* Dynamic count */}
        </div>

        {/* Total Parents Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">{t("totalParents")}</h2>
          <p className="text-3xl font-bold text-green-500">120</p>
        </div>

        {/* Pending Registrations Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">
            {t("pendingRegistrations")}
          </h2>
          <p className="text-3xl font-bold text-yellow-500">8</p>
        </div>

        {/* Total Students Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">{t("totalStudents")}</h2>
          <p className="text-3xl font-bold text-purple-500">500</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Manage Teachers Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">{t("manageTeachers")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t("manageTeachersDescription")}
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            {t("goToTeachers")}
          </button>
        </div>

        {/* Manage Parents Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">{t("manageParents")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t("manageParentsDescription")}
          </p>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            {t("goToParents")}
          </button>
        </div>

        {/* View Grades Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">{t("viewGrades")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t("viewGradesDescription")}
          </p>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
            {t("goToGrades")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
