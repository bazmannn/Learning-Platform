import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Modal } from "../components/Modal";
import {
  getEnrolledStudents,
  approveEnrollment,
} from "../../../services/course";

interface EnrolledStudent {
  studentId: string;
  studentName: string;
  parentName: string;
  parentEmail: string;
  enrollmentStatus: "PENDING" | "APPROVED";
  enrolledAt: string;
}

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  courseId,
}) => {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && courseId) {
      loadEnrolledStudents();
    }
  }, [isOpen, courseId]);

  const loadEnrolledStudents = async () => {
    setIsLoading(true);
    try {
      const data = await getEnrolledStudents(courseId);
      setStudents(data);
    } catch (error) {
      console.error("Error loading enrolled students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (studentId: string) => {
    setIsLoading(true);
    try {
      await approveEnrollment(courseId, studentId);
      // Update the local state to reflect the change
      setStudents(
        students.map((student) =>
          student.studentId === studentId
            ? { ...student, enrollmentStatus: "APPROVED" }
            : student
        )
      );
    } catch (error) {
      console.error("Error approving student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Enrollments">
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400">
              No enrolled students found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Parent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Enrolled Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {students.map((student) => (
                  <tr key={student.studentId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {student.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {student.parentName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {student.parentEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(student.enrolledAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          student.enrollmentStatus === "APPROVED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {student.enrollmentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {student.enrollmentStatus === "PENDING" && (
                        <button
                          onClick={() => handleApprove(student.studentId)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
                          disabled={isLoading}
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EnrollmentModal;
