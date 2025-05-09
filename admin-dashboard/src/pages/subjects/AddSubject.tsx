import { useState } from "react";
import { useTranslation } from "react-i18next";
import { addSubject } from "../../services/subject";
import { useNavigate } from "react-router-dom";

const AddSubject = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    level: "PRIMARY" as "PRIMARY" | "MIDDLE" | "SECONDARY",
    stream: "" as "SCIENCES" | "MATHEMATICS" | "LITERATURE" | "TECHNICAL" | "",
    year: "FIRST" as "FIRST" | "SECOND" | "THIRD" | "FOURTH" | "FIFTH",
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
    if (!formData.name || !formData.level || !formData.year) {
      setError("Missing required fields");
      setLoading(false);
      return;
    }

    try {
      await addSubject({
        name: formData.name,
        level: formData.level,
        year: formData.year,
        stream:
          formData.level === "SECONDARY"
            ? formData.stream || undefined
            : undefined,
      });
      alert("Subject added successfully!");
      navigate("/admin/subjects");
    } catch (err) {
      setError("Failed to add subject. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{t("addSubject")}</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("name")}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
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
            <option value="PRIMARY">Primary</option>
            <option value="MIDDLE">Middle</option>
            <option value="SECONDARY">Secondary</option>
          </select>
        </div>

        {/* Year Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">{t("year")}</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            required
          >
            <option value="FIRST">1st Year</option>
            <option value="SECOND">2nd Year</option>
            <option value="THIRD">3rd Year</option>
            <option value="FOURTH">4th Year</option>
            <option value="FIFTH">5th Year</option>
          </select>
        </div>

        {/* Stream Selection (Only for Secondary Level) */}
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
              <option value="SCIENCES">Sciences</option>
              <option value="MATHEMATICS">Mathematics</option>
              <option value="LITERATURE">Literature</option>
              <option value="TECHNICAL">Technical</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? t("addingSubject") : t("addSubject")}
        </button>
      </form>
    </div>
  );
};

export default AddSubject;
