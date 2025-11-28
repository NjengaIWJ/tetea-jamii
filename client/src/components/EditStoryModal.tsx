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

const EditStoryModal: React.FC<EditStoryModalProps> = ({
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
      [field]: value,
    });
  };

  return (
    <dialog
      open
      aria-labelledby="edit-story-title"
      aria-modal
      className="fixed inset-0 z-50 w-full h-full bg-black/50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-surface-2 dark:bg-surface-3 rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-4 relative"
        role="dialog"
        aria-modal="true"
      >
        <h2 id="edit-story-title" className="text-2xl font-bold mb-6 text-primary-var">
          Edit Story
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="space-y-6">
            <div>
              <label htmlFor="edit-title" className="block text-md font-medium mb-2 text-secondary-var">
                Title
              </label>
              <input
                id="edit-title"
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                disabled={isPending}
                className="input-base"
              />
            </div>

            <div>
              <label className="block text-md font-medium mb-2 text-secondary-var">Images</label>
              <DropZone onFilesAdded={onFilesAdded} disabled={isPending} maxFiles={maxFiles} />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {form.previewItems.map((pi) => (
                  <div key={pi.id} className="relative group overflow-hidden rounded-lg shadow-lg bg-surface-2 dark:bg-surface-3">
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
              <label htmlFor="edit-content" className="block text-md font-medium mb-2 text-secondary-var">
                Content
              </label>
              <textarea
                id="edit-content"
                value={form.content}
                onChange={(e) => handleChange('content', e.target.value)}
                required
                rows={5}
                disabled={isPending}
                className="input-base"
              />
            </div>

            <div className="flex items-center justify-end gap-4 mt-6">
              <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg font-medium btn-ghost">
                Cancel
              </button>
              <button type="submit" disabled={isPending} className={`px-6 py-2 rounded-lg btn-primary font-medium ${isPending ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <LucideLoaderPinwheel className="animate-spin" aria-hidden="true" />
                    <span>Updating...</span>
                  </div>
                ) : (
                    'Update Story'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default EditStoryModal;