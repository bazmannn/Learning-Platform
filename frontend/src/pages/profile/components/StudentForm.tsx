import {
  Level,
  Stream,
  Student,
  StudentFormData,
  Year,
} from "../../../types/types";
import { useTranslation } from "react-i18next";

interface StudentFormProps {
  isEdit: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  studentData?: StudentFormData;
  setStudentData?: (data: StudentFormData) => void;
  editingStudent?: Student | null;
  setEditingStudent?: (student: Student | null) => void;
  loading: boolean;
}

const StudentForm = ({
  isEdit,
  onSubmit,
  studentData,
  setStudentData,
  editingStudent,
  setEditingStudent,
  loading,
}: StudentFormProps) => {
  const { t } = useTranslation("profile");

  // Define the dependencies
  const levelYearDependencies: { [key in Level]?: Year[] } = {
    PRIMARY: [Year.FIRST, Year.SECOND, Year.THIRD, Year.FOURTH, Year.FIFTH],
    MIDDLE: [Year.FIRST, Year.SECOND, Year.THIRD, Year.FOURTH],
    SECONDARY: [Year.FIRST, Year.SECOND, Year.THIRD],
  };

  const streamLevels: Level[] = [Level.SECONDARY];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (isEdit && editingStudent && setEditingStudent) {
      setEditingStudent({ ...editingStudent, [name]: value });
    } else if (setStudentData) {
      setStudentData({ ...studentData, [name]: value } as StudentFormData);
    }
  };

  const getAvailableYears = (level: Level): Year[] => {
    return levelYearDependencies[level] || [];
  };

  const showStream = (level: Level): boolean => {
    return streamLevels.includes(level);
  };

  const getLevel = (): Level => {
    return (
      (isEdit && editingStudent ? editingStudent.level : studentData?.level) ||
      Level.PRIMARY
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {t("firstName")}
        </label>
        <input
          type="text"
          name="firstName"
          value={
            isEdit && editingStudent
              ? editingStudent.firstName
              : studentData?.firstName || ""
          }
          onChange={handleInputChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {t("lastName")}
        </label>
        <input
          type="text"
          name="lastName"
          value={
            isEdit && editingStudent
              ? editingStudent.lastName
              : studentData?.lastName || ""
          }
          onChange={handleInputChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {t("level")}
        </label>
        <select
          name="level"
          value={
            isEdit && editingStudent
              ? editingStudent.level
              : studentData?.level || Level.PRIMARY
          }
          onChange={handleInputChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          required
        >
          <option value="">{t("selectLevel")}</option>
          {Object.values(Level).map((level) => (
            <option key={level} value={level}>
              {t(`level.${level.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {t("year")}
        </label>
        <select
          name="year"
          value={
            isEdit && editingStudent
              ? editingStudent.year
              : studentData?.year || ""
          }
          onChange={handleInputChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          required
        >
          <option value="">{t("selectYear")}</option>
          {getAvailableYears(getLevel()).map((year) => (
            <option key={year} value={year}>
              {t(`year.${year.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </div>
      {showStream(getLevel()) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {t("stream")}
          </label>
          <select
            name="stream"
            value={
              isEdit && editingStudent
                ? editingStudent.stream || ""
                : studentData?.stream || ""
            }
            onChange={handleInputChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="">{t("selectStream")}</option>
            {Object.values(Stream).map((stream) => (
              <option key={stream} value={stream}>
                {t(`stream.${stream.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        ) : isEdit ? (
          t("updateStudent")
        ) : (
          t("addStudent")
        )}
      </button>
    </form>
  );
};

export default StudentForm;
