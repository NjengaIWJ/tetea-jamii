import React, { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { AxiosError, type AxiosProgressEvent } from "axios";
import api from "../api/axios";
import { Eraser, Loader2Icon } from "lucide-react";
import Docx from './docs';
import useAdminStore from "../stores/admin.stores";
/* import { usePostInfo } from "../api/api";
 */
const Docs: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { admin } = useAdminStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");
    setMessage("");
    const selected = e.target.files?.[0] ?? null;

    if (selected) {
      // File type validation
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(selected.type)) {
        setErrorMessage("Please upload only PDF or Word documents.");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // File size validation (5MB)
      const maxSizeBytes = 5 * 1024 * 1024;
      if (selected.size > maxSizeBytes) {
        setErrorMessage("File size must be less than 5 MB.");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // File name validation
      if (selected.name.length > 100) {
        setErrorMessage("File name is too long. Please rename the file.");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setFile(selected);
      setMessage("File selected successfully!");
    } else {
      setFile(null);
      setMessage("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!file) {
      setErrorMessage("Please select a file to upload");
      return;
    }

    if (!title || title.trim().length === 0) {
      setErrorMessage("Please enter a title for the document");
      return;
    }

    if (title.length > 100) {
      setErrorMessage("Title is too long. Maximum 100 characters allowed.");
      return;
    }

    setMessage("");
    setErrorMessage("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());

    try {
      setIsUploading(true);
      await api.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setMessage(`Uploading: ${progress}%`);
        },
      });

      setMessage("Document uploaded successfully!");

      // Reset form
      setTimeout(() => {
        setFile(null);
        setTitle("");
        setMessage("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 3000);

    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMsg = error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "An error occurred while uploading the document";
        setErrorMessage(errorMsg);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
      console.error("Document upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-12">
        <Docx />
      </div>
      {admin && location.pathname.startsWith('docs') && (<div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Document</h2>
        {isUploading && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3">
            <Loader2Icon size={20} className="animate-spin" /> {message || "Uploading document..."}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setMessage("");
                setErrorMessage("");
              }}
              placeholder="Enter document title"
              required
              disabled={isUploading}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Document File <span className="text-red-500">*</span>
            </label>
            <input
              id="file"
              name="media"
              type="file"
              accept=".doc,.docx,.pdf,.txt,.rtf,.odt,.xlsx,.pptx,.csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,text/plain,application/rtf,application/vnd.oasis.opendocument.text,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/csv"
              onChange={fileChange}
              required
              disabled={isUploading}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            <p className="mt-1 text-sm text-gray-500">
              Maximum file size: 5MB. Allowed formats: PDF, Word, Text, Excel, PowerPoint, CSV
            </p>
          </div>
          {file && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Selected: <strong>{file.name}</strong> ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                disabled={isUploading}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
              >
                <Eraser size={16} /> Clear
              </button>
            </div>
          )}
          {errorMessage && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <Eraser size={16} /> {errorMessage}
            </div>
          )}
          {message && !isUploading && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg">
              {message}
            </div>
          )}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-colors"
          >
            {isUploading ? "Uploading…" : "Upload Document"}
          </button>
        </form>
      </div>)}
    </main>
  );
};

export default Docs;
