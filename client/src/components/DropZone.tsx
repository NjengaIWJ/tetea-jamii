import React, { type DragEvent, useCallback, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '../utils/cn';

interface DropZoneProps {
  onFilesAdded: (files: FileList | File[]) => void;
  disabled?: boolean;
  className?: string;
  maxFiles?: number;
  accept?: string;
  children?: React.ReactNode;
}

const DropZone: React.FC<DropZoneProps> = ({
  onFilesAdded,
  disabled = false,
  className,
  maxFiles = 8,
  accept = "image/*",
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  }, []);

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounterRef.current = 0;
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        onFilesAdded(files);
      }
    },
    [onFilesAdded]
  );

  const defaultContent = children ?? (
    <>
      <UploadCloud size={40} className="text-green-600 mb-3" aria-hidden="true" />
      <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
        Drag & drop here, or <span className="text-green-600 underline">click to browse</span>
      </p>
      <p className="mt-1 text-sm text-gray-500">PNG, JPG, WebP (up to {maxFiles} files)</p>
    </>
  );

  return (
    <div
      onDragEnter={disabled ? undefined : onDragEnter}
      onDragLeave={disabled ? undefined : onDragLeave}
      onDragOver={disabled ? undefined : onDragOver}
      onDrop={disabled ? undefined : onDrop}
      className={cn(
        'relative flex flex-col items-center justify-center w-full p-4 rounded-lg cursor-pointer border-2 border-dashed transition-all duration-200',
        isDragging ? "border-green-500 bg-green-50/60" : "border-green-200 bg-white/50 hover:border-green-400",
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFilesAdded(e.target.files);
            e.target.value = '';
          }
        }}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Choose files"
      />
      {defaultContent}
    </div>
  );
};

export default DropZone;