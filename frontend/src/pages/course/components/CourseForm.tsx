import React, { useState, useEffect } from "react";
import { Course } from "../../../types/types";
import { getTeacherSubjects } from "../../../services/teacher";
import { useAuth } from "../../../contexts/AuthContext";

interface Subject {
  subjectId: string;
  name: string;
  level: "PRIMARY" | "MIDDLE" | "SECONDARY";
  stream: string | null;
  year: string;
}

interface CourseFormProps {
  initialData?: Course;
  onSubmit: (data: { [key: string]: any }) => void;
  onCancel: () => void;
  isLoading: boolean; // Add isLoading prop
}

export const CourseForm: React.FC<CourseFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading, // Destructure isLoading
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Omit<Course, "id">>({
    topics: initialData?.topics || [],
    courseId: initialData?.courseId || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    isPublic: initialData?.isPublic || false,
    subjectId: initialData?.subjectId || "",
    image: initialData?.image || "",
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");

  const levels = Array.from(new Set(subjects.map((s) => s.level)));
  const years = Array.from(
    new Set(
      subjects
        .filter((s) => !selectedLevel || s.level === selectedLevel)
        .map((s) => s.year)
    )
  );
  const streams = Array.from(
    new Set(
      subjects
        .filter(
          (s) =>
            (!selectedLevel || s.level === selectedLevel) &&
            (!selectedYear || s.year === selectedYear)
        )
        .map((s) => s.stream)
        .filter(Boolean)
    )
  );

  const filteredSubjects = subjects.filter(
    (subject) =>
      (!selectedLevel || subject.level === selectedLevel) &&
      (!selectedYear || subject.year === selectedYear) &&
      (!selectedStream || subject.stream === selectedStream)
  );

  useEffect(() => {
    const fetchSubjects = async () => {
      if (user?.teacherId) {
        const fetchedSubjects = await getTeacherSubjects(user.teacherId);
        setSubjects(fetchedSubjects);

        if (initialData) {
          const initialSubject = fetchedSubjects.find(
            (s: { subjectId: string }) => s.subjectId === initialData.subjectId
          );

          if (initialSubject) {
            setSelectedLevel(initialSubject.level);
            setSelectedYear(initialSubject.year);
            setSelectedStream(initialSubject.stream || "");
            setFormData({
              topics: initialData.topics || [],
              courseId: initialData.courseId || "",
              title: initialData.title || "",
              description: initialData.description || "",
              isPublic: initialData.isPublic || false,
              subjectId: initialData.subjectId || "",
              image: initialData.image || "",
            });
          }
        }
      }
    };
    fetchSubjects();
  }, [user?.teacherId, initialData]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, subjectId: "" }));
  }, [selectedLevel, selectedYear, selectedStream]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setImageBase64(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = {
      title: formData.title,
      description: formData.description,
      isPublic: formData.isPublic,
      subjectId: formData.subjectId,
      image: imageBase64 || formData.image,
    };

    console.log("Form data to send:", formDataToSend); // Debugging log

    onSubmit(formDataToSend);
  };

  if (isLoading) {
    return (
      <div className="max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xl font-bold">Loading...</p>
        </form>
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            rows={3}
          />
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Education Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">Select Level</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {selectedLevel && (
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year.charAt(0) + year.slice(1).toLowerCase()} Year
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedLevel === "SECONDARY" && selectedYear && (
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Stream
              </label>
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="">Select Stream</option>
                {streams.map((stream) => (
                  <option key={stream} value={stream || ""}>
                    {stream && stream.charAt(0) + stream.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filteredSubjects.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Subject
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) =>
                  setFormData({ ...formData, subjectId: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              >
                <option value="">Select Subject</option>
                {filteredSubjects.map((subject) => (
                  <option key={subject.subjectId} value={subject.subjectId}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Course Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isPublic}
            onChange={(e) =>
              setFormData({ ...formData, isPublic: e.target.checked })
            }
            className="rounded dark:bg-gray-800 dark:border-gray-700"
          />
          <label className="text-sm font-medium dark:text-gray-200">
            Make Course Public
          </label>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100 
                       dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
                       dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {initialData ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
};
