import type React from "react";
import { useGetInfo } from "../api/api";
import { LucideLoaderPinwheel } from "lucide-react";
import { Link } from "react-router-dom";  

interface Document {
  _id: string;
  title: string;
  cloudinaryUrl: string;
  fileName: string;
  uploadDate: string;
  mimetype: string;
  size: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse {
  success: boolean;
  data: {
    items: Document[];
    pagination: PaginationInfo;
  };
  message?: string;
  error?: string;
}

const Docx: React.FC = () => {
  const { data: apiResponse, error, isError, isPending } = useGetInfo<ApiResponse>(import.meta.env.VITE_APP_DOCS_URL);

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <LucideLoaderPinwheel className="animate-spin" />
        <span className="ml-2">Loading documents...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <main className="bg-red-100 p-4 rounded-md">
        <h2 className="text-lg font-semibold">Error</h2>
        <p>{error instanceof Error ? error.message : "Unknown error"}</p>
      </main>
    );
  }

  const documents = apiResponse?.data?.items ?? [];

  return (
    <main className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Documents</h2>
      
      <section className="space-y-4">
        {documents.length === 0 ? (
          <p className="text-gray-500 text-center p-8 bg-white rounded-lg shadow">No documents available.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6">
            {documents.map((doc: Document) => (
              <li key={doc._id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{doc.title}</h3>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-500">File: {doc.fileName}</span>
                    <span className="text-xs text-gray-400">Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                  </div>
                  {/*     <a
                    href={doc.cloudinaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  > */}
                  <Link to={doc._id} className="mr-2">
                    View Document
                  </Link>
                  {/*                   </a>
 */}                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Docx;