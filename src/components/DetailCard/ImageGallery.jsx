import React from 'react';

function ImageGallery({ destination, onImageSelect }) {
    if (!destination) return null;

    const images = destination.imageUrls || (destination.imageUrl ? [destination.imageUrl] : []);

    return (
        <div id="image-gallery" className="flex gap-2 overflow-x-auto">
            {images.map((url, index) => (
                <img 
                    key={index}
                    src={url} 
                    alt={`${destination.name} 图片 ${index + 1}`} 
                    className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={() => onImageSelect(url)} 
                />
            ))}
        </div>
    );
}

export default ImageGallery;