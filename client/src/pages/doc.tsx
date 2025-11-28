// DocModule.tsx
import React from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/error";
import { useGetInfo } from "../api/api";

interface Doc {
  id: string;
  title: string;
  content: string;
  media: string[];
}

interface DocCardProps {
  doc: Doc;
}

const DocCard: React.FC<DocCardProps> = ({ doc }) => {
  const thumbnailUrl = doc.media.length > 0 ? doc.media[0] : undefined;

  return (
    <Link
      to={`/docs/${doc.id}`}
      className="group block bg-surface-2 dark:bg-surface-3 rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 duration-200 overflow-hidden border border-surface"
    >
      {thumbnailUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={`${doc.title} thumbnail`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-5">
        <h2 className="text-2xl font-semibold text-primary-var mb-2">
          {doc.title}
        </h2>
        <p className="text-secondary-var line-clamp-3">
          {doc.content}
        </p>
      </div>
    </Link>
  );
};

interface PdfViewerProps {
  url: string;
}

const ResponsiveViewer: React.FC<PdfViewerProps> = ({ url }) => {
  if (!url) return null;

  const lower = url.toLowerCase();
  const isPdf = lower.endsWith(".pdf");
  const isImage = lower.match(/\.(jpeg|jpg|png|gif|webp)$/);

  // For PDFs show an iframe that fits the container; for images show responsive img.
  // For other types (docx, pptx) attempt Google Docs viewer; otherwise provide direct link.
  if (isPdf) {
    return (
      <div className="w-full min-h-[60vh] md:min-h-[80vh]">
        <iframe src={url} title="PDF Viewer" className="w-full h-full border-0" />
      </div>
    );
  }

  if (isImage) {
    return (
      <div className="w-full">
        <img src={url} alt="document preview" className="w-full h-auto rounded-lg object-cover" />
      </div>
    );
  }

  // attempt Google Docs viewer for other formats
  const googleViewer = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  return (
    <div className="w-full min-h-[60vh] md:min-h-[80vh] bg-gray-50 rounded-lg overflow-hidden">
      <iframe src={googleViewer} title="Document Viewer" className="w-full h-full border-0" />
      <div className="mt-2 text-sm">
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600">Open original</a>
      </div>
    </div>
  );
};

/* DocViewer intentionally inlined inside DocView (to keep structure simple) */

const DocView: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { data, error, isError, isPending } = useGetInfo<Doc | Doc[]>(
    `${import.meta.env.VITE_APP_DOCS_URL}/${id}`
  );

  if (!id) {
    return <ErrorMessage message="No document ID provided in the URL." />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message ?? "Something went wrong fetching the document."} />;
  }

  if (isPending) {
    return <LoadingSpinner message="Please wait while we fetch the document." />;
  }

  if (!data) {
    return <ErrorMessage message="No document found." />;
  }

  // If API returned a list, show cards; otherwise show viewer
  if (Array.isArray(data)) {
    return (
      <main className="min-h-screen bg-surface py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-accent">Documents</h1>
            <p className="mt-2 text-secondary-var">Select a document to view.</p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((doc) => <DocCard key={doc.id} doc={doc} />)}
          </div>
        </div>
      </main>
    );
  }

  // Single document view
  const doc = data as Doc;
  const firstMedia = doc.media?.[0];

  return (
    <main className="min-h-screen bg-surface py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-accent">{doc.title}</h1>
            <p className="text-sm text-secondary-var">Document details and viewer</p>
          </div>
          <div className="flex gap-3">
            {firstMedia && (
              <a href={firstMedia} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-surface-2 border border-surface text-accent">Open original</a>
            )}
            <a href={`/docs`} className="px-4 py-2 rounded-full btn-primary">Back to Documents</a>
          </div>
        </div>

        <div className="bg-surface-2 dark:bg-surface-3 rounded-2xl p-6 shadow">
          {firstMedia ? (
            <div className="mb-6">
              <ResponsiveViewer url={firstMedia} />
            </div>
          ) : (
              <div className="p-6 text-center text-secondary-var">No preview available. You can download the document to view it.</div>
          )}

          <div className="prose dark:prose-invert text-primary-var">
            {doc.content}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DocView;
