import { useState, useEffect } from "react";
import { getStudentsByParentId } from "../../../services/student";
import { enrollStudentToCourse } from "../../../services/parent";
import {
  X,
  UserPlus,
  Loader2,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  parentId: string;
  onEnrollmentComplete: () => void;
  courseLevel: string;
  courseYear: string;
}

interface Enrollment {
  enrollmentId: string;
  studentId: string;
  parentId: string;
  courseId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  enrolledAt: string;
}

interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  level: string;
  year: string;
  stream: string | null;
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
  Enrollment?: Enrollment[];
}

const EnrollStudentModal = ({
  isOpen,
  onClose,
  courseId,
  parentId,
  onEnrollmentComplete,
  courseLevel,
  courseYear,
}: EnrollStudentModalProps) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingStudents, setEnrollingStudents] = useState<Set<string>>(
    new Set()
  );
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState<{
    id: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const studentsData = await getStudentsByParentId(parentId);
        const filteredStudents = studentsData.filter(
          (student: { level: string; year: string }) =>
            student.level === courseLevel && student.year === courseYear
        );
        setStudents(filteredStudents);
      } catch (error) {
        setError("Failed to fetch students. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && parentId) {
      fetchStudents();
    }
  }, [isOpen, parentId, courseLevel, courseYear]);

  const handleEnroll = async (studentId: string) => {
    setEnrollingStudents((prev) => new Set(prev).add(studentId));
    setError("");
    setSuccessMessage(null);

    try {
      await enrollStudentToCourse({
        parentId,
        studentId,
        courseId,
      });

      setSuccessMessage({
        id: studentId,
        message: "Enrollment request sent!",
      });
      onEnrollmentComplete();

      // Update the student's status in the list
      setStudents((prev) =>
        prev.map((student) =>
          student.studentId === studentId
            ? {
                ...student,
                Enrollment: [
                  {
                    enrollmentId: Date.now().toString(), // temporary ID
                    studentId,
                    parentId,
                    courseId,
                    status: "PENDING",
                    enrolledAt: new Date().toISOString(),
                  },
                ],
              }
            : student
        )
      );
    } catch (error) {
      setError("Failed to enroll student. Please try again.");
    } finally {
      setEnrollingStudents((prev) => {
        const updated = new Set(prev);
        updated.delete(studentId);
        return updated;
      });
    }
  };

  const getEnrollmentStatus = (student: Student) => {
    const courseEnrollment = student.Enrollment?.find(
      (e) => e.courseId === courseId
    );
    return courseEnrollment?.status;
  };

  const getStudentAction = (student: Student) => {
    const status = getEnrollmentStatus(student);

    switch (status) {
      case "PENDING":
        return (
          <div className="px-4 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-lg flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Waiting for Approval</span>
          </div>
        );
      case "APPROVED":
        return (
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Enter Course</span>
          </button>
        );
      default:
        return (
          <button
            onClick={() => handleEnroll(student.studentId)}
            disabled={enrollingStudents.has(student.studentId)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
              ${
                enrollingStudents.has(student.studentId)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                  : successMessage?.id === student.studentId
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500"
              }`}
          >
            {enrollingStudents.has(student.studentId) ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enrolling...</span>
              </>
            ) : successMessage?.id === student.studentId ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Enrolled!</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Enroll</span>
              </>
            )}
          </button>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Course Registration
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Students (Level: {courseLevel}, Year: {courseYear})
            </h3>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Loading students...
                </p>
              </div>
            ) : students.length > 0 ? (
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.studentId}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {student.firstName} {student.lastName}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {student.level} - Year {student.year}
                        </p>
                      </div>
                    </div>

                    {getStudentAction(student)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No eligible students found for this course level and year.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollStudentModal;
