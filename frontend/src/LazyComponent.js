import React from 'react';

const LazyComponent = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid green', borderRadius: '5px', backgroundColor: '#e6ffe6', marginTop: '20px' }}>
      <h3>This is a Lazy Loaded Component!</h3>
      <p>It was loaded on demand using React.lazy and Suspense.</p>
    </div>
  );
};

export default LazyComponent;
