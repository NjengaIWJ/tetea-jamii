import React, { useState } from 'react';

interface Partner {
  _id: string;
  name: string;
  media: string;
}

const PartnerCard: React.FC<{ partner: Partner; className?: string }> = ({ partner, className = '' }) => {
  const [loaded, setLoaded] = useState(false);

  return (
  // keep the card fluid (parent controls min-width for scroller responsiveness)
  // Make the inner card focusable and responsive so keyboard users can tab into each partner.
    <div
      className={`w-full bg-surface-2 rounded-2xl p-4 shadow text-center ${className} focus:outline-none`}
      tabIndex={0}
      aria-label={`Partner ${partner.name}`}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden mx-auto mb-3 relative">
        {/* skeleton while loading */}
        {!loaded && (
          <div className="absolute inset-0 bg-surface-3 animate-pulse" />
        )}
        <img
          src={partner.media}
          alt={partner.name}
          className={`w-full h-full object-cover block transition-opacity duration-300 ${loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="font-medium text-primary-var truncate">{partner.name}</div>
    </div>
  );
};

export default PartnerCard;
