import React from 'react';
import Image from 'next/image';
import { InstagramImage } from '../types/api';

interface InstagramFeedProps {
  images: InstagramImage[];
  loading: boolean;
}

const InstagramFeed: React.FC<InstagramFeedProps> = ({ images, loading }) => {
  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="card aspect-square bg-gray-100 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg text-gray-500">No Instagram images found for this location.</p>
          <p className="text-sm text-gray-400 mt-2">Try searching for a different location or a larger city.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <a 
              key={image.id} 
              href={image.profileUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="card overflow-hidden group"
            >
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={image.caption || 'Instagram image'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-medium">@{image.username}</p>
                  <p className="text-white/80 text-sm truncate">{image.caption || ''}</p>
                  <div className="flex items-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500 mr-1">
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                    <span className="text-white text-sm">{image.likes}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstagramFeed; 