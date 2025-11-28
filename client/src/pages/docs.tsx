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
    <main className="min-h-screen bg-surface py-8 px-4">
      <Section size="lg">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-accent">Documents & Resources</h1>
          <p className="mt-2 text-secondary-var max-w-2xl mx-auto">Browse reports, forms and resources produced by Tetea Jamii. Click a document to view it in the browser.</p>
        </header>

        {isPending && (
          <div className="flex items-center justify-center p-8">
            <LucideLoaderPinwheel className="animate-spin" />
            <span className="ml-2">Loading documents...</span>
          </div>
        )}

        {isError && (
          <div className="max-w-2xl mx-auto mb-6 bg-error-light border border-error text-error p-4 rounded-lg">
            <h3 className="font-semibold">Error</h3>
            <p>{error instanceof Error ? error.message : "Unknown error"}</p>
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.length === 0 ? (
            <div className="col-span-full text-center p-6 bg-surface-2 rounded-lg shadow">No documents available.</div>
          ) : (
              documents.map((doc: Document) => (
                <article key={doc._id} className="bg-surface-2 dark:bg-surface-3 rounded-2xl p-4 shadow hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold mb-2 text-primary-var">{doc.title}</h3>
                  <p className="text-sm text-secondary-var mb-4">{doc.fileName} • {new Date(doc.uploadDate).toLocaleDateString()}</p>
                  <div className="flex gap-3">
                    <Link to={`/docs/${doc._id}`} className="inline-block px-4 py-2 btn-primary rounded-full">View</Link>
                    <a href={doc.cloudinaryUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 border border-surface text-accent rounded-full hover:bg-surface-3">Download</a>
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