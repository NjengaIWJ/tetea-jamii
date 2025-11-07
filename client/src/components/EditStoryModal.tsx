import React from 'react';
import { X, LucideLoaderPinwheel } from 'lucide-react';
import DropZone from './DropZone';

export interface PreviewItem {
  id: string;
  file: File | null;
  url: string;
}

export interface EditFormData {
  title: string;
  content: string;
  previewItems: PreviewItem[];
}

interface EditStoryModalProps {
  form: EditFormData | null;
  maxFiles?: number;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onFormChange: (newForm: EditFormData | null) => void;
  onFilesAdded: (files: FileList | File[]) => void;
  onFileRemove: (id: string) => void;
}

export const EditStoryModal: React.FC<EditStoryModalProps> = ({
  form,
  maxFiles = 8,
  isOpen,
  isPending,
  onClose,
  onSubmit,
  onFormChange,
  onFilesAdded,
  onFileRemove,
}) => {
  if (!isOpen || !form) return null;

  const handleChange = (field: keyof EditFormData, value: string) => {
    onFormChange({
      ...form,
      [field]: value
    });
  };

  return (
    <dialog
      open
      aria-labelledby="edit-story-title"
      aria-modal
      className="fixed inset-0 z-50 w-full h-full bg-black/50 flex items-center justify-center"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-4 relative"
        role="dialog"
        aria-modal="true"
      >
        <h2 id="edit-story-title" className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Edit Story</h2>
        <form onSubmit={e => { e.preventDefault(); onSubmit(); }}>
          <div className="space-y-6">
            <div>
              <label htmlFor="edit-title" className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-200">
                Title
              </label>
              <input
                id="edit-title"
                type="text"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                required
                disabled={isPending}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            <div>
              <label className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-200">
                Images
              </label>
              <DropZone
                onFilesAdded={onFilesAdded}
                disabled={isPending}
                maxFiles={maxFiles}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {form.previewItems.map(pi => (
                  <div key={pi.id} className="relative group overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800">
                    <img
                      src={pi.url}
                      alt={pi.file?.name || 'Story image'}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={() => onFileRemove(pi.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X size={24} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="edit-content" className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-200">
                Content
              </label>
              <textarea
                id="edit-content"
                value={form.content}
                onChange={e => handleChange('content', e.target.value)}
                required
                rows={5}
                disabled={isPending}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            <div className="flex items-center justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={`
                  px-6 py-2 rounded-lg bg-green-600 text-white font-medium shadow transition-all duration-200
                  ${isPending
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-green-700 hover:shadow-lg"}
                `}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <LucideLoaderPinwheel className="animate-spin" aria-hidden="true" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Story"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
};