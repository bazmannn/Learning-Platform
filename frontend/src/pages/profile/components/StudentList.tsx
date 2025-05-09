import { Student } from "../../../types/types";
import { useTranslation } from "react-i18next";

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

const StudentList = ({ students, onEdit, onDelete }: StudentListProps) => {
  const { t } = useTranslation("profile");

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {students.map((student) => (
        <div
          key={student.studentId}
          className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800"
        >
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(`level.${student.level.toLowerCase()}`)} -{" "}
                {t(`year.${student.year.toLowerCase()}`)}
              </p>
              {student.stream && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t(`stream.${student.stream.toLowerCase()}`)}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => onEdit(student)}
                className="rounded px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700"
              >
                {t("edit")}
              </button>
              <button
                onClick={() => onDelete(student.studentId)}
                className="rounded px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentList;
