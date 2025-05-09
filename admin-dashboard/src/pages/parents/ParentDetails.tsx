import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { getParentById, editParent, deleteParent } from "../../services/parent";

interface Parent {
  parentId: string;
  userId: string;
  user: {
    address: string;
    phoneNumber: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  address: string;
  students: Student[]; // Add students array
}

interface Student {
  studentId: string;
  userId: string;
  parentId: string;
  firstName: string;
  lastName: string;
  className: string;
}

const ParentDetails = () => {
  const { t } = useTranslation("common");
  const { parentId } = useParams<{ parentId: string }>();
  const [parent, setParent] = useState<Parent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParent = async () => {
      try {
        if (!parentId) {
          throw new Error("Parent ID is missing");
        }
        const data = await getParentById(parentId);
        setParent(data);
        setFormData({
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phoneNumber: data.user.phoneNumber,
          address: data.user.address,
        });
      } catch (err) {
        setError("Failed to fetch parent details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchParent();
  }, [parentId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!parentId) {
      alert("Parent ID is missing");
      return;
    }

    try {
      await editParent(parentId, {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      });
      alert("Parent updated successfully!");
      setEditMode(false);
    } catch (err) {
      alert("Failed to update parent. Please try again.");
    }
  };

  const handleDeleteParent = async () => {
    if (!parentId) {
      alert("Parent ID is missing");
      return;
    }

    if (window.confirm("Are you sure you want to delete this parent?")) {
      try {
        await deleteParent(parentId);
        alert("Parent deleted successfully!");
        navigate("/admin/parents");
      } catch (err) {
        alert("Failed to delete parent. Please try again.");
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!parent) {
    return <p>Parent not found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">{t("parentDetails")}</h1>

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
              {t("phoneNumber")}
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("address")}
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
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
            {parent.user.firstName} {parent.user.lastName}
          </h2>
          <p className="text-gray-700 dark:text-white mb-4">
            <strong>{t("email")}:</strong> {parent.user.email}
          </p>
          <p className="text-gray-700 dark:text-white mb-4">
            <strong>{t("phoneNumber")}:</strong> {parent.user.phoneNumber}
          </p>
          <p className="text-gray-700 dark:text-white mb-6">
            <strong>{t("address")}:</strong> {parent.user.address}
          </p>

          <h3 className="text-2xl font-bold mb-4">{t("students")}</h3>
          <ul className="list-disc list-inside">
            {parent.students.map((student) => (
              <li key={student.studentId}>
                {student.firstName} {student.lastName} - {student.className}
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t("edit")}
            </button>
            <button
              onClick={handleDeleteParent}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              {t("delete")}
            </button>
            <button
              onClick={() => navigate("/admin/parents")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {t("back")}
            </button>
            <button
              onClick={() =>
                navigate(
                  `/admin/add-student?email=${parent.user.email}&lastName=${parent.user.lastName}`
                )
              }
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              {t("addStudent")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDetails;
