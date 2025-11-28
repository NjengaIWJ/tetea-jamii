import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Story {
  id: string;
  title: string;
  content: string;
  media: string[];
}

const StoryCard: React.FC<{ story: Story; className?: string; onEdit?: () => void; onDelete?: () => void; isDeleting?: boolean }> = ({ 
  story, 
  className = '', 
  onEdit, 
  onDelete,
  isDeleting = false 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const StoryContent = () => (
    <>
      {story.media?.length > 0 && (
        <div className="h-48 overflow-hidden relative">
          {/* Skeleton while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-surface-3 dark:bg-surface-4 animate-pulse" />
          )}
          <img 
            src={story.media[0]} 
            alt={`${story.title} thumbnail`} 
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary-var mb-2">{story.title}</h2>
        <p className="text-secondary-var line-clamp-3 text-sm">{story.content}</p>
      </div>
    </>
  );

  // If we have admin actions, wrap content in div instead of Link
  if (onEdit || onDelete) {
    return (
      <div className={`group relative bg-surface-2 dark:bg-surface-3 rounded-2xl shadow-md overflow-hidden border border-surface ${className}`}>
        <Link to={`/stories/${story.id}`}>
          <StoryContent />
        </Link>
        {/* Admin Actions */}
        <div className="absolute top-2 right-2 flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1 rounded-full btn-ghost text-sm"
              aria-label={`Edit ${story.title}`}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="px-3 py-1 rounded-full btn-danger text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              aria-label={`Delete ${story.title}`}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/stories/${story.id}`}
      className={`group block bg-surface-2 dark:bg-surface-3 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-200 overflow-hidden border border-surface ${className}`}
    >
      <StoryContent />
    </Link>
  );
};

export default StoryCard;
