import React from "react";
import { useParams } from "react-router-dom";
import { useGetInfo } from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/error";
import SkeletonImage from "../components/SkeletonLooader";

type Params = { id: string };

interface Story {
  id: string;
  title: string;
  content: string;
  date?: string;
  media: string | string[];
}

const ImageModal: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => (
  <div
    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-inverted-var hover:text-secondary-var transition-colors"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img src={url} alt="" className="max-w-full max-h-full object-contain" />
    </div>
  </div>
);

const Story: React.FC = () => {
  const { id } = useParams<Params>();
  const { data, error, isError, isPending } = useGetInfo<Story>(`${import.meta.env.VITE_APP_ARTS_URL}/${id}`);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  // Guard: missing ID
  if (!id) {
    return <ErrorMessage message="No story ID provided in the URL." />;
  }

  // Error state
  if (isError) {
    return (
      <ErrorMessage
        message={error?.message ?? "Something went wrong fetching the story."}
      />
    );
  }

  // Loading state
  if (isPending) {
    return <LoadingSpinner message="Please wait while we fetch the story." />;
  }

  // Normalize media into an array
  const mediaItems = data?.media
    ? Array.isArray(data.media)
      ? data.media
      : [data.media]
    : [];

  return (
    <React.Fragment>
      {selectedImage && (
        <ImageModal url={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-primary-var">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section with Featured Image */}
        <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            <SkeletonImage
              src={mediaItems[0]}
              alt={`${data?.title} cover`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 text-white">
            <div className="max-w-3xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight text-accent">
                {data?.title}
              </h1>
              {data?.date && (
                <time className="inline-flex items-center text-sm sm:text-base text-slate-200 bg-black/30 px-4 py-2 rounded-full">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {new Date(data.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
            </div>
          </div>
        </div>

          <div className="mb-6 flex items-center gap-4">
            <a href="/stories" className="text-sm text-accent">← Back to Stories</a>
          </div>

        {/* Image Gallery */}
        {mediaItems.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12">
            {mediaItems.slice(1).map((url: string, i: number) => (
              <button
                key={i}
                onClick={() => setSelectedImage(url)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-3 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <SkeletonImage
                  src={url}
                  alt={`${data?.title} — image ${i + 2}`}
                  className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-white text-sm font-medium">
                    View Full Image
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Content Section */}
          <article className="relative max-w-prose mx-auto bg-surface-2 rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-t-2xl" />
          <div className="prose prose-slate dark:prose-invert prose-lg md:prose-xl">
            <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line first-letter:text-4xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
              {data?.content}
            </p>
          </div>
        </article>
      </div>
    </main>
    </React.Fragment>
  );
};

export default Story;
