import React, { useState } from "react";
import { Trash2, Plus, Edit } from "lucide-react";
import { Topic, Content } from "../../../types/types";
import { ContentForm } from "./ContentForm";
import { ContentItem } from "./ContentItem";

interface TopicSectionProps {
  topic: Topic;
  onDeleteTopic: (topicId: string) => void;
  onAddContent: (topicId: string, content: Content) => void;
  onUpdateTopic: (topicId: string, newTitle: string) => void;
  onUpdateContent: (
    contentId: string,
    newType: string,
    newData: string
  ) => void;
  onDeleteContent: (contentId: string) => void;
  isLoading: boolean; // Add isLoading prop
}

export const TopicSection: React.FC<TopicSectionProps> = ({
  topic,
  onDeleteTopic,
  onAddContent,
  onUpdateTopic,
  onUpdateContent,
  onDeleteContent,
  isLoading, // Destructure isLoading
}) => {
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(topic.title);

  const handleUpdateTitle = async () => {
    await onUpdateTopic(topic.topicId!, newTitle);
    setIsEditingTitle(false);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <p className="text-lg font-medium dark:text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-center">
        {isEditingTitle ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <button
              onClick={handleUpdateTitle}
              className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditingTitle(false)}
              className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <h4 className="text-lg font-medium dark:text-white">{topic.title}</h4>
        )}
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditingTitle(true)}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => setIsAddingContent(!isAddingContent)}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => onDeleteTopic(topic.topicId!)}
            className="p-1 text-red-600 hover:bg-red-100 rounded dark:text-red-400 dark:hover:bg-red-900/50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isAddingContent && (
        <div className="mt-4">
          <ContentForm
            onSubmit={(content) => {
              onAddContent(topic.topicId!, content);
              setIsAddingContent(false);
            }}
            onCancel={() => setIsAddingContent(false)}
            topicId={topic.topicId!}
            isLoading={false}
          />
        </div>
      )}

      <div className="mt-4 space-y-2">
        {topic.contents?.map((content) => (
          <ContentItem
            key={content.contentId}
            content={content}
            onUpdateContent={onUpdateContent}
            onDeleteContent={onDeleteContent}
            isLoading={false}
          />
        ))}
      </div>
    </div>
  );
};
