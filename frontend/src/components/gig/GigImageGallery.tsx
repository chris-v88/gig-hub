import React from 'react';
import type { Gig } from '../../api/gig';

export type GigImageGalleryProps = {
  gig: Gig;
};

const GigImageGallery = (props: GigImageGalleryProps) => {
  const { gig } = props;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gig.images && gig.images.length > 0 ? (
          <>
            <div className="md:col-span-2">
              <img
                src={gig.images[0]}
                alt="Gig preview"
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
            </div>
            {gig.images.slice(1).map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`Gig preview ${index + 2}`}
                className="w-full h-32 md:h-40 object-cover rounded-lg"
              />
            ))}
          </>
        ) : gig.image_url ? (
          <div className="md:col-span-2">
            <img
              src={gig.image_url}
              alt="Gig preview"
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="md:col-span-2 bg-gray-200 rounded-lg h-64 md:h-80 flex items-center justify-center">
            <span className="text-gray-500">No images available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigImageGallery;
