import type React from "react";
import { useGetInfo } from "../api/api";
import { LucideLoaderPinwheel } from "lucide-react";
import { Link } from "react-router-dom";  
import Section from "../components/Section";

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

  const documents = apiResponse?.data?.items ?? [];

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 py-8 px-4">
      <Section size="lg">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-green-900 dark:text-green-300">Documents & Resources</h1>
          <p className="mt-2 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">Browse reports, forms and resources produced by Tetea Jamii. Click a document to view it in the browser.</p>
        </header>

        {isPending && (
          <div className="flex items-center justify-center p-8">
            <LucideLoaderPinwheel className="animate-spin" />
            <span className="ml-2">Loading documents...</span>
          </div>
        )}

        {isError && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg">
            <h3 className="font-semibold">Error</h3>
            <p>{error instanceof Error ? error.message : "Unknown error"}</p>
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.length === 0 ? (
            <div className="col-span-full text-center p-6 bg-white rounded-lg shadow">No documents available.</div>
          ) : (
              documents.map((doc: Document) => (
                <article key={doc._id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{doc.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{doc.fileName} • {new Date(doc.uploadDate).toLocaleDateString()}</p>
                  <div className="flex gap-3">
                    <Link to={`/docs/${doc._id}`} className="inline-block px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700">View</Link>
                    <a href={doc.cloudinaryUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 border border-green-200 text-green-700 rounded-full hover:bg-green-50">Download</a>
                  </div>
                </article>
              ))
          )}
        </section>
      </Section>
    </main>
  );
};

export default Docx;