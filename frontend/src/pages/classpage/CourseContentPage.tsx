import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Video, Link as LinkIcon, Link } from "lucide-react";
import { useEffect, useState } from "react";
import { getCourseById } from "../../services/course"; // Adjust the path as needed

interface CourseResponse {
  courseId: string;
  title: string;
  description: string;
  teacherId: string;
  isPublic: boolean;
  subjectId: string;
  image: string;
  topics: {
    topicId: string;
    title: string;
    courseId: string;
    contents: {
      contentId: string;
      type: string;
      data: string;
      topicId: string;
    }[];
  }[];
  teacher: {
    teacherId: string;
    userId: string;
    bio: string | null;
    user: { firstName: string; lastName: string };
  };
  enrollments: [];
  subject: {
    subjectId: string;
    name: string;
    level: string;
    stream: string | null;
    year: string;
  };
  quizzes: [];
  exams: [];
}

const CourseContentPage = () => {
  const { t } = useTranslation("coursecontent");
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState<CourseResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const data = await getCourseById(courseId || "");
        setCourseDetails(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

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
            {t("courseNotFound")}
          </h2>
          <Link
            to="/courses"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Browse all courses
          </Link>
        </div>
      </div>
    );
  }

  const convertToEmbedUrl = (url: string): string => {
    // Regular expression to match YouTube URLs
    const ytRegex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/)?([a-zA-Z0-9_-]+)(?:\S+)?$/;
    const match = url.match(ytRegex);

    if (match && match[1]) {
      // Extract the video ID from the URL
      const videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // If the URL does not match, return the original URL
    return url;
  };

  const renderContent = (content: any) => {
    switch (content.type) {
      case "TEXT":
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-900 dark:text-white">{content.data}</p>
          </div>
        );
      case "YOUTUBE_VIDEO":
        const embedUrl = convertToEmbedUrl(content.data);
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <p className="text-gray-900 dark:text-white">{t("video")}</p>
            </div>
            <iframe
              src={embedUrl}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-64 rounded-lg"
            ></iframe>
          </div>
        );
      case "LINK":
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <p className="text-gray-900 dark:text-white">{content.data}</p>
            </div>
            <a
              href={content.data}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 flex items-center gap-2"
            >
              {t("visitLink")}
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-blue-600 dark:bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(`/class/${courseId}`)}
            className="text-white/80 hover:text-white flex items-center gap-2 mb-6 w-fit transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("backToClass")}
          </button>
          <h1 className="text-4xl font-bold">{t("courseContent")}</h1>
        </div>
      </div>

      {/* Topics List */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {courseDetails.topics.map((topic) => (
            <div
              key={topic.topicId}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {topic.title}
              </h2>
              <div className="space-y-4">
                {topic.contents.map((content, index) => (
                  <div key={index}>{renderContent(content)}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseContentPage;
