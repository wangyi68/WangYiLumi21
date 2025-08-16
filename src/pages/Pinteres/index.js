import React, { useState } from "react";
import { pinterest } from "../../config/pinterest";
import { Skeleton } from "../../components/ui/Skeleton";

export const Heading = ({ name, emoji, sId }) => (
  <h2 id={sId} className="text-4xl font-bold">
    {emoji} {name}
  </h2>
);

function PinterestPage() {
  const [modalImage, setModalImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (rank) => {
    setLoadedImages(prev => ({ ...prev, [rank]: true }));
  };

  return (
    <div className="p-4">
      <Heading name="Pinterest" emoji="🌟" sId="pinterest" />
      <p className="mt-4 text-neutral-400">
        Pinterest <span className="underline underline-offset-2">Image</span> Preview{" "}
        <span className="text-neutral-500">那些事...</span>
      </p>

      <div className="fade-in-left mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[896px]">
        {pinterest.map(({ rank, name, description, image, url }) => (
          <div 
            key={rank} 
            className="group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <a
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                setModalImage(image);
              }}
              className="block relative"
            >
              {!loadedImages[rank] && (
                <Skeleton src={image} className="absolute inset-0" />
              )}
              <img
                src={image}
                alt={name}
                onLoad={() => handleImageLoad(rank)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${loadedImages[rank] ? 'opacity-100' : 'opacity-0'}`}
                style={{ aspectRatio: '16/9' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                <p className="text-xl font-bold text-white">
                  <span className="text-neutral-300">{rank} </span>
                  {name}
                </p>
                <p className="text-sm text-neutral-300"># {description}</p>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Modal preview */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={modalImage}
              alt="Preview"
              className="max-h-[90vh] w-auto max-w-full mx-auto object-contain rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white text-2xl font-bold w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton khi load
const PinterestPageSkeleton = () => {
  return (
    <div className="fade-in-left mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[896px]">
      {pinterest.map((item, i) => (
        <Skeleton key={i} src={item.image} className="rounded-lg" />
      ))}
    </div>
  );
};

// Lazy load
const LazyPinterestPage = React.lazy(() =>
  Promise.resolve({ default: PinterestPage })
);

export default function PinterestPageWrapper() {
  return (
    <React.Suspense fallback={<PinterestPageSkeleton />}>
      <LazyPinterestPage />
    </React.Suspense>
  );
}
