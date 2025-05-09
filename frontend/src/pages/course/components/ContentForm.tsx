import React, { useState } from "react";
import { Content, ContentType } from "../../../types/types";

interface ContentFormProps {
  initialContent?: Content | null;
  onSubmit: (content: Content) => void;
  onCancel: () => void;
  topicId: string;
  isLoading: boolean; // Add isLoading prop
}

export const ContentForm: React.FC<ContentFormProps> = ({
  initialContent,
  onSubmit,
  onCancel,
  topicId,
  isLoading, // Destructure isLoading
}) => {
  const [content, setContent] = useState<Content>({
    contentId: initialContent?.contentId || "",
    type: initialContent?.type || ContentType.TEXT,
    data: initialContent?.data || "",
    topicId: topicId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(content);
  };

  if (isLoading) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xl font-bold">Loading...</p>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Content Type
        </label>
        <select
          value={content.type}
          onChange={(e) =>
            setContent({ ...content, type: e.target.value as ContentType })
          }
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value={ContentType.TEXT}>Text</option>
          <option value={ContentType.LINK}>Link</option>
          <option value={ContentType.YOUTUBE_VIDEO}>YouTube Video</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Content Data
        </label>
        <textarea
          value={content.data}
          onChange={(e) => setContent({ ...content, data: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          rows={5}
          required
        />
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
          {initialContent ? "Update Content" : "Add Content"}
        </button>
      </div>
    </form>
  );
};
