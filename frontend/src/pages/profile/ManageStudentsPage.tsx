import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import {
  getStudentsByParentId,
  addStudent,
  deleteStudent,
  updateStudent,
} from "../../services/student";
import {
  Level,
  Stream,
  Year,
  Student,
  StudentFormData,
} from "../../types/types";
import StudentList from "./components/StudentList";
import AddStudentModal from "./components/AddStudentModal";
import EditStudentModal from "./components/EditStudentModal";

const ManageStudentsPage = () => {
  const { t } = useTranslation("profile");
  const { user } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentData, setStudentData] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    level: "",
    year: "",
    stream: "",
  });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
      const fetchedStudents = await getStudentsByParentId(user.parentId);
      setStudents(fetchedStudents);
    } catch (err) {
      setError("Failed to fetch students. Please try again.");
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !studentData.level || !studentData.year) return;

    setLoading(true);
    setError(null);

    try {
      await addStudent({
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        level: studentData.level as Level,
        year: studentData.year as Year,
        stream: studentData.stream ? (studentData.stream as Stream) : undefined,
        parentEmail: user.email,
      });
      await fetchStudents();
      setIsAddModalOpen(false);
      setStudentData({
        firstName: "",
        lastName: "",
        level: "",
        year: "",
        stream: "",
      });
    } catch (err) {
      setError("Failed to add student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setLoading(true);
    setError(null);

    try {
      // Get the new student data from the form
      const newStudentData = {
        firstName: editingStudent.firstName,
        lastName: editingStudent.lastName,
        level: editingStudent.level,
        year: editingStudent.year,
        stream: editingStudent.stream,
      };

      // Check if the new level is PRIMARY or MIDDLE
      if (
        newStudentData.level === Level.PRIMARY ||
        newStudentData.level === Level.MIDDLE
      ) {
        newStudentData.stream = undefined; // Set stream to undefined
      }

      // Update the student
      await updateStudent(editingStudent.studentId, newStudentData);
      await fetchStudents();
      setIsEditModalOpen(false);
    } catch (err) {
      setError("Failed to update student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm(t("deleteConfirmation"))) {
      setLoading(true);
      setError(null);

      try {
        await deleteStudent(studentId);
        await fetchStudents();
      } catch (err) {
        setError("Failed to delete student. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("manageStudents")}
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t("addNewStudent")}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}

        <StudentList
          students={students}
          onEdit={(student) => {
            setEditingStudent(student);
            setIsEditModalOpen(true);
          }}
          onDelete={handleDeleteStudent}
        />

        <AddStudentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddStudent}
          studentData={studentData}
          setStudentData={setStudentData}
          loading={loading}
        />

        <EditStudentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateStudent}
          editingStudent={editingStudent}
          setEditingStudent={setEditingStudent}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ManageStudentsPage;
