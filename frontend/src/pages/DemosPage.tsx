/**
 * Demos and Runbooks Page
 * Interactive demonstrations and operational guides
 */

import React, { useState } from 'react';
import { PlayCircle, BookOpen, Code } from 'lucide-react';
import { useDemoScenarios, useRunbooks } from '../hooks/useData';
import { Card, LoadingSpinner, ErrorMessage, EmptyState } from '../components/common';
import { DemoScenario, Runbook } from '../types';

export const DemosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'demos' | 'runbooks'>('demos');
  const { data: demos, loading: demosLoading, error: demosError } = useDemoScenarios();
  const { data: runbooks, loading: runbooksLoading, error: runbooksError } = useRunbooks();
  const [selectedRunbook, setSelectedRunbook] = useState<Runbook | null>(null);

  const loading = demosLoading || runbooksLoading;
  const error = demosError || runbooksError;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Demos & Runbooks</h1>
        <p className="mt-2 text-gray-600">Interactive demos and operational procedures</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('demos')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'demos'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <PlayCircle className="h-5 w-5 inline mr-2" />
            Demo Scenarios
          </button>
          <button
            onClick={() => setActiveTab('runbooks')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'runbooks'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BookOpen className="h-5 w-5 inline mr-2" />
            Runbooks
          </button>
        </nav>
      </div>

      {/* Demo Scenarios Tab */}
      {activeTab === 'demos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {demos?.map((demo) => (
            <Card key={demo.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{demo.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{demo.description}</p>
                </div>
                <span className={`badge ${
                  demo.difficulty === 'beginner' ? 'badge-success' :
                  demo.difficulty === 'intermediate' ? 'badge-warning' :
                  'badge-error'
                }`}>
                  {demo.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>⏱ {demo.estimatedTime} min</span>
                <span className="badge bg-blue-100 text-blue-800">{demo.category}</span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-gray-700">Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  {demo.steps.slice(0, 3).map((step) => (
                    <li key={step.id}>{step.title}</li>
                  ))}
                  {demo.steps.length > 3 && (
                    <li className="text-gray-400">+{demo.steps.length - 3} more steps...</li>
                  )}
                </ol>
              </div>

              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <PlayCircle className="h-4 w-4" />
                Start Demo
              </button>
            </Card>
          ))}

          {(!demos || demos.length === 0) && (
            <div className="col-span-2">
              <EmptyState
                icon={<PlayCircle className="h-12 w-12 text-gray-400" />}
                title="No demo scenarios available"
                description="Demo scenarios will appear here"
              />
            </div>
          )}
        </div>
      )}

      {/* Runbooks Tab */}
      {activeTab === 'runbooks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Runbooks List */}
          <div className="lg:col-span-1 space-y-3">
            {runbooks?.map((runbook) => (
              <div
                key={runbook.id}
                className={`card cursor-pointer transition-all ${
                  selectedRunbook?.id === runbook.id
                    ? 'ring-2 ring-primary-600 bg-primary-50'
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedRunbook(runbook)}
              >
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">{runbook.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{runbook.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {runbook.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="badge bg-gray-100 text-gray-600 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {(!runbooks || runbooks.length === 0) && (
              <EmptyState
                icon={<BookOpen className="h-12 w-12 text-gray-400" />}
                title="No runbooks available"
                description="Runbooks will appear here"
              />
            )}
          </div>

          {/* Runbook Details */}
          <div className="lg:col-span-2">
            {selectedRunbook ? (
              <Card>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedRunbook.title}</h2>
                  <p className="text-gray-600">{selectedRunbook.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <span>Category: {selectedRunbook.category}</span>
                    <span>•</span>
                    <span>Updated: {selectedRunbook.lastUpdated}</span>
                    <span>•</span>
                    <span>By: {selectedRunbook.author}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedRunbook.tags.map((tag) => (
                      <span key={tag} className="badge bg-primary-100 text-primary-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedRunbook.steps.map((step, index) => (
                    <div key={step.id} className="border-l-4 border-primary-600 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {index + 1}. {step.title}
                      </h3>
                      <div
                        className="prose prose-sm max-w-none text-gray-600 mb-3"
                        dangerouslySetInnerHTML={{ __html: step.content }}
                      />
                      {step.code && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-700 flex items-center">
                              <Code className="h-3 w-3 mr-1" />
                              {step.language || 'bash'}
                            </span>
                            <button
                              onClick={() => navigator.clipboard.writeText(step.code || '')}
                              className="text-xs text-primary-600 hover:text-primary-700"
                            >
                              Copy
                            </button>
                          </div>
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{step.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a runbook</h3>
                  <p className="text-sm text-gray-500">Choose a runbook from the list to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
