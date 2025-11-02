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
      className="group block bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 duration-200 overflow-hidden border border-green-100 dark:border-gray-700"
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
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {doc.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {doc.content}
        </p>
      </div>
    </Link>
  );
};

interface PdfViewerProps {
  url: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => (
  <div style={{ width: "100%", height: "100vh" }}>
    <iframe
      src={url}
      title="Document Viewer"
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  </div>
);

interface DocViewerProps {
  doc: Doc;
}

const DocViewer: React.FC<DocViewerProps> = ({ doc }) => {
  if (!doc) {
    return <ErrorMessage message="Document data is missing." />;
  }

  const { title, media = [], content } = doc;
  const firstMedia = media.length > 0 ? media[0] : undefined;
  const isPdf = firstMedia?.toLowerCase().endsWith(".pdf");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 border border-green-100 dark:border-gray-700">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {title}
      </h1>

      {firstMedia && (
        <div className="mb-6">
          {isPdf ? (
            <PdfViewer url={firstMedia} />
          ) : (
            <img
              src={firstMedia}
              alt={`${title} preview`}
              className="w-full h-auto object-cover rounded-lg"
              loading="lazy"
            />
          )}
        </div>
      )}

      <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300">
        {content}
      </div>
    </div>
  );
};

const DocView: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  const { data, error, isError, isPending } = useGetInfo<Doc | Doc[]>(
    `${import.meta.env.VITE_APP_DOCS_URL}/${id}`
  );

  if (!id) {
    return <ErrorMessage message="No document ID provided in the URL." />;
  }

  console.log("data", data);

  if (isError) {
    return (
      <ErrorMessage
        message={error?.message ?? "Something went wrong fetching the document."}
      />
    );
  }

  if (isPending) {
    return <LoadingSpinner message="Please wait while we fetch the document." />;
  }

  if (!data) {
    return <ErrorMessage message="No document found." />;
  }

  return (
    <div className="space-y-4">
      {Array.isArray(data)
        ? data.map((doc) => <DocCard key={doc.id} doc={doc} />)
        : <DocViewer doc={data} />}
    </div>
  );
};

export default DocView;
