import React from 'react';

const ImageOptimizer = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid purple', borderRadius: '5px', backgroundColor: '#f3e6ff', marginTop: '20px' }}>
      <h3>Image Optimization Demo</h3>
      <p>This image uses lazy loading and srcset for responsiveness.</p>
      <img
        src="https://via.placeholder.com/300"
        srcSet="https://via.placeholder.com/150 150w, https://via.placeholder.com/300 300w, https://via.placeholder.com/600 600w"
        sizes="(max-width: 600px) 150px, (max-width: 1200px) 300px, 600px"
        alt="Placeholder for optimized image"
        loading="lazy"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default ImageOptimizer;
