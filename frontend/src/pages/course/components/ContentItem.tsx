import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Content, ContentType } from "../../../types/types";

interface ContentItemProps {
  content: Content;
  onUpdateContent: (
    contentId: string,
    newType: string,
    newData: string
  ) => void;
  onDeleteContent: (contentId: string) => void;
  isLoading: boolean; // Add isLoading prop
}

export const ContentItem: React.FC<ContentItemProps> = ({
  content,
  onUpdateContent,
  onDeleteContent,
  isLoading, // Destructure isLoading
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newType, setNewType] = useState<ContentType>(content.type);
  const [newData, setNewData] = useState(content.data);

  const handleUpdate = async () => {
    await onUpdateContent(content.contentId!, newType, newData);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
      {isEditing ? (
        <div className="space-y-2">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as ContentType)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="TEXT">Text</option>
            <option value="LINK">Link</option>
            <option value="YOUTUBE_VIDEO">YouTube Video</option>
          </select>
          <textarea
            value={newData}
            onChange={(e) => setNewData(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            rows={3}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-700 dark:text-gray-300">{content.data}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {content.type}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded dark:text-blue-400 dark:hover:bg-blue-900/50"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDeleteContent(content.contentId!)}
              className="p-1 text-red-600 hover:bg-red-100 rounded dark:text-red-400 dark:hover:bg-red-900/50"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
