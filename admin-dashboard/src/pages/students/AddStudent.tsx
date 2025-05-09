import { useState } from "react";
import { useTranslation } from "react-i18next";
import { addStudent } from "../../services/student";
import { useNavigate, useLocation } from "react-router-dom";

const AddStudent = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: searchParams.get("lastName") || "",
    level: "",
    year: "",
    parentEmail: searchParams.get("email") || "",
    stream: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate input
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.level ||
      !formData.year ||
      !formData.parentEmail
    ) {
      setError("Missing required fields");
      setLoading(false);
      return;
    }

    if (formData.level === "SECONDARY" && !formData.stream) {
      setError("Stream is required for secondary level students");
      setLoading(false);
      return;
    }

    try {
      await addStudent({
        firstName: formData.firstName,
        lastName: formData.lastName,
        level: formData.level,
        year: formData.year,
        parentEmail: formData.parentEmail,
        stream: formData.stream,
      });
      alert("Student added successfully!");
      navigate("/admin/students");
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError(
          "A student with the same name already exists for this parent."
        );
      } else {
        setError("Failed to add student. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Define the levels and years for the dropdown menus
  const levels = [
    { value: "PRIMARY", label: "Primary" },
    { value: "MIDDLE", label: "Middle" },
    { value: "SECONDARY", label: "Secondary" },
  ];

  const primaryYears = [
    { value: "FIRST", label: "First" },
    { value: "SECOND", label: "Second" },
    { value: "THIRD", label: "Third" },
    { value: "FOURTH", label: "Fourth" },
    { value: "FIFTH", label: "Fifth" },
  ];

  const middleYears = [
    { value: "FIRST", label: "First" },
    { value: "SECOND", label: "Second" },
    { value: "THIRD", label: "Third" },
    { value: "FOURTH", label: "Fourth" },
  ];

  const secondaryYears = [
    { value: "FIRST", label: "First" },
    { value: "SECOND", label: "Second" },
    { value: "THIRD", label: "Third" },
  ];

  const streams = [
    { value: "SCIENCES", label: "Sciences" },
    { value: "MATHEMATICS", label: "Mathematics" },
    { value: "LITERATURE", label: "Literature" },
    { value: "TECHNICAL", label: "Technical" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{t("addStudent")}</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-sm font-medium mb-1">{t("level")}</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            required
          >
            <option value="">Select Level</option>
            {levels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {formData.level && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("year")}
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              required
            >
              <option value="">Select Year</option>
              {formData.level === "PRIMARY" &&
                primaryYears.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              {formData.level === "MIDDLE" &&
                middleYears.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              {formData.level === "SECONDARY" &&
                secondaryYears.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
            </select>
          </div>
        )}

        {formData.level === "SECONDARY" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("stream")}
            </label>
            <select
              name="stream"
              value={formData.stream}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              required
            >
              <option value="">Select Stream</option>
              {streams.map((stream) => (
                <option key={stream.value} value={stream.value}>
                  {stream.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("parentEmail")}
          </label>
          <input
            type="email"
            name="parentEmail"
            value={formData.parentEmail}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? t("addingStudent") : t("addStudent")}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
