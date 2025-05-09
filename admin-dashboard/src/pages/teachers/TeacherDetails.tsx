import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../../services/teacher";
import { getSubjectsByLevel } from "../../services/subject";

interface Subject {
  subjectId: string;
  name: string;
  level: "PRIMARY" | "MIDDLE" | "SECONDARY";
  stream: "SCIENCES" | "MATHEMATICS" | "LITERATURE" | "TECHNICAL" | null;
  year: "FIRST" | "SECOND" | "THIRD" | "FOURTH" | "FIFTH";
}

interface Teacher {
  teacherId: string;
  userId: string;
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  subjects: Subject[]; // Updated to Subject[]
  bio: string;
}

const LEVELS = ["PRIMARY", "MIDDLE", "SECONDARY"] as const;
const STREAMS = ["SCIENCES", "MATHEMATICS", "LITERATURE", "TECHNICAL"] as const;

const TeacherDetails = () => {
  const { t } = useTranslation("common");
  const { teacherId } = useParams<{ teacherId: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    subjects: [] as string[], // Still an array of strings for the form
    bio: "",
  });
  const [allSubjects, setAllSubjects] = useState<Record<string, Subject[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        if (!teacherId) {
          throw new Error("Teacher ID is missing");
        }
        const data = await getTeacherById(teacherId);
        setTeacher(data);
        setFormData({
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          subjects: data.subjects.map((subject: Subject) => subject.name), // Map subjects to names
          bio: data.bio,
        });
      } catch (err) {
        setError("Failed to fetch teacher details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [teacherId]);

  useEffect(() => {
    const fetchAllSubjects = async () => {
      try {
        const subjectsByLevel: Record<string, Subject[]> = {};
        await Promise.all(
          LEVELS.map(async (level) => {
            const data = await getSubjectsByLevel(level);
            subjectsByLevel[level] = data;
          })
        );
        setAllSubjects(subjectsByLevel);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      }
    };

    fetchAllSubjects();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleSubject = (subject: Subject) => {
    setFormData((prev) => {
      const subjectIndex = prev.subjects.findIndex((s) => s === subject.name);
      const subjects =
        subjectIndex === -1
          ? [...prev.subjects, subject.name]
          : prev.subjects.filter((s) => s !== subject.name);
      return { ...prev, subjects };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId) {
      alert("Teacher ID is missing");
      return;
    }

    try {
      await updateTeacher(teacherId, {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        subjects: formData.subjects.map((subject) => ({ name: subject })), // Map to the correct format
        bio: formData.bio,
      });
      alert("Teacher updated successfully!");
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      alert("Failed to update teacher. Please try again.");
    }
  };

  const handleDeleteTeacher = async () => {
    if (!teacherId) {
      alert("Teacher ID is missing");
      return;
    }

    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteTeacher(teacherId);
        alert("Teacher deleted successfully!");
        navigate("/admin/teachers");
      } catch (err) {
        alert("Failed to delete teacher. Please try again.");
      }
    }
  };

  const getFilteredSubjects = () => {
    const filtered: Record<string, Subject[]> = {};

    LEVELS.forEach((level) => {
      const levelSubjects = allSubjects[level] || [];
      const filteredLevelSubjects = levelSubjects.filter((subject) =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredLevelSubjects.length > 0) {
        filtered[level] = filteredLevelSubjects;
      }
    });

    return filtered;
  };

  const groupSubjectsByStream = (subjects: Subject[]) => {
    const grouped: Record<string, Subject[]> = {
      NO_STREAM: subjects.filter((s) => !s.stream),
    };

    STREAMS.forEach((stream) => {
      const streamSubjects = subjects.filter((s) => s.stream === stream);
      if (streamSubjects.length > 0) {
        grouped[stream] = streamSubjects;
      }
    });

    return grouped;
  };

  const filteredSubjects = getFilteredSubjects();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!teacher) {
    return <p>Teacher not found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">{t("teacherDetails")}</h1>

      {editMode ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("email")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("firstName")}
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("lastName")}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("subjects")}
            </label>
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
            />

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {formData.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() =>
                        toggleSubject({
                          subjectId: "",
                          name: subject,
                          level: "PRIMARY",
                          stream: null,
                          year: "FIRST",
                        })
                      }
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto border rounded p-4 space-y-4">
              {Object.entries(filteredSubjects).map(([level, subjects]) => (
                <div key={level} className="space-y-2">
                  <h3 className="font-semibold text-lg border-b pb-2">
                    {t(level.toLowerCase())}
                  </h3>

                  {Object.entries(groupSubjectsByStream(subjects)).map(
                    ([stream, streamSubjects]) => (
                      <div key={stream} className="ml-4 space-y-1">
                        {stream !== "NO_STREAM" && (
                          <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">
                            {t(stream.toLowerCase())}
                          </h4>
                        )}
                        <div className="grid grid-cols-2 gap-1">
                          {streamSubjects.map((subject) => (
                            <button
                              key={subject.subjectId}
                              type="button"
                              onClick={() => toggleSubject(subject)}
                              className={`p-2 text-left rounded transition-colors ${
                                formData.subjects.includes(subject.name)
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              {subject.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("bio")}</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              {t("save")}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {teacher.user.firstName} {teacher.user.lastName}
          </h2>
          <p className="text-gray-700 dark:text-white mb-4">
            <strong>{t("email")}:</strong> {teacher.user.email}
          </p>
          <p className="text-gray-700 dark:text-white mb-4">
            <strong>{t("subjects")}:</strong>
            {teacher.subjects.map((subject) => (
              <div key={subject.subjectId}>
                {subject.name} ({subject.level}, {subject.stream || "No Stream"}
                , {subject.year})
              </div>
            ))}
          </p>
          <p className="text-gray-700 dark:text-white mb-6">
            <strong>{t("bio")}:</strong> {teacher.bio}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t("edit")}
            </button>
            <button
              onClick={handleDeleteTeacher}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              {t("delete")}
            </button>
            <button
              onClick={() => navigate("/admin/teachers")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {t("back")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDetails;
