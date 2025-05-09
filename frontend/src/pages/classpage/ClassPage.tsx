import { useTranslation } from "react-i18next";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Clock, User, Calendar, BookOpen, Award, Users } from "lucide-react";
import ClassHeader from "./ClassHeader";
import { useEffect, useState } from "react";
import { getCourseById } from "../../services/course";
import EnrollStudentModal from "./components/EnrollStudentModal";
import { useAuth } from "../../contexts/AuthContext";

interface CourseResponse {
  courseId: string;
  title: string;
  description: string;
  teacherId: string;
  isPublic: boolean;
  subjectId: string;
  image: string;
  topics: { topicId: string; title: string; courseId: string }[];
  teacher: {
    teacherId: string;
    userId: string;
    bio: string;
    user: { firstName: string; lastName: string };
  };
  enrollments: [];
  subject: {
    subjectId: string;
    name: string;
    level: string;
    stream: null;
    year: string;
  };
  quizzes: [];
  exams: [];
}

const ClassPage = () => {
  const { t } = useTranslation("classpage");
  const navigate = useNavigate();
  const { classId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [courseDetails, setCourseDetails] = useState<CourseResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const data = await getCourseById(classId || "");
        setCourseDetails(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [classId]);

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      // Redirect to login if user is not authenticated
      navigate("/login", { state: { from: `/class/${classId}` } });
      return;
    }
    if (!user.parentId) {
      // Handle case where user is not a parent
      // You might want to show an error message or redirect
      console.error("User is not authorized to enroll students");
      return;
    }
    setIsEnrollModalOpen(true);
  };

  const handleEnrollmentComplete = () => {
    // Refresh course details to update enrollment count
    if (classId) {
      getCourseById(classId).then((data) => {
        setCourseDetails(data);
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t("loadingCourse")}
          </h2>
        </div>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t("classNotFound")}
          </h2>
          <Link
            to="/classes"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Browse all classes
          </Link>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <Clock className="w-5 h-5" />,
      label: t("duration"),
      value: "TBD",
    },
    {
      icon: <User className="w-5 h-5" />,
      label: t("instructor"),
      value: `${courseDetails.teacher.user.firstName} ${courseDetails.teacher.user.lastName}`,
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: t("startDate"),
      value: "TBD",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: t("enrolled"),
      value: courseDetails.enrollments.length.toString(),
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: t("level"),
      value: courseDetails.subject.level,
    },
  ];

  const handleCourseAction = () => {
    if (courseDetails.isPublic) {
      navigate(`/course/${classId}`);
    } else {
      handleEnrollClick();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ClassHeader
        title={courseDetails.title}
        image={courseDetails.image}
        category={courseDetails.subject.name}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t("aboutCourse")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {courseDetails.description}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t("whatYouWillLearn")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseDetails.topics.map((topic, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600 mt-1" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {topic.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sticky top-8">
              <div className="space-y-6 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {feature.label}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {feature.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCourseAction}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {courseDetails.isPublic ? t("viewCourse") : t("enrollNow")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {user?.parentId && (
        <EnrollStudentModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          courseId={classId || ""}
          parentId={user.parentId}
          onEnrollmentComplete={handleEnrollmentComplete}
          courseLevel={courseDetails.subject.level}
          courseYear={courseDetails.subject.year}
        />
      )}
    </div>
  );
};

export default ClassPage;
