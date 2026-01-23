import React, { Suspense, lazy } from 'react';
import logo from './logo.svg';
import './App.css';
import ErrorBoundary from './ErrorBoundary';
import ImageOptimizer from './ImageOptimizer';
import { StateProvider, useStateContext } from './StateContext';
import useApi from './useApi';

const LazyComponent = lazy(() => import('./LazyComponent'));

const Counter = () => {
  const { count, increment, decrement } = useStateContext();
  return (
    <div style={{ padding: '20px', border: '1px solid blue', borderRadius: '5px', backgroundColor: '#e6f7ff', marginTop: '20px' }}>
      <h3>State Management Demo</h3>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement} style={{ marginLeft: '10px' }}>Decrement</button>
    </div>
  );
};

const ApiDataFetcher = () => {
  // Simulate an API call that might fail
  const mockApiCall = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve({ message: 'Data fetched successfully!' });
        } else {
          reject(new Error('Failed to fetch data.'));
        }
      }, 1000);
    });
  };

  const { data, loading, error, refetch } = useApi(mockApiCall);

  return (
    <div style={{ padding: '20px', border: '1px solid orange', borderRadius: '5px', backgroundColor: '#fff3e6', marginTop: '20px' }}>
      <h3>API Data Fetcher with Retry Logic</h3>
      {loading && <p>Loading data...</p>}
      {error && (
        <div>
          <p style={{ color: 'red' }}>Error: {error.message}</p>
          <button onClick={refetch}>Retry Fetch</button>
        </div>
      )}
      {data && <p>{data.message}</p>}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <StateProvider>
        <div className="App" role="main">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="React logo" aria-label="React logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Learn React Link"
            >
              Learn React
            </a>
          </header>
          <Suspense fallback={<div>Loading Lazy Component...</div>}>
            <LazyComponent />
          </Suspense>
          <ImageOptimizer />
          <Counter />
          <ApiDataFetcher />
        </div>
      </StateProvider>
    </ErrorBoundary>
  );
}

export default App;
