/**
 * Onboarding Page
 * Interactive guides for users and operators
 */

import React from 'react';
import { BookOpen, CheckCircle, Clock, Play } from 'lucide-react';
import { useOnboardingGuides } from '../hooks/useData';
import { apiClient } from '../services/api';
import { Card, LoadingSpinner, ErrorMessage, StatusBadge } from '../components/common';
import { OnboardingGuide, OnboardingStepStatus } from '../types';

export const OnboardingPage: React.FC = () => {
  const { data: guides, loading, error, refetch } = useOnboardingGuides();

  const handleStartGuide = async (guideId: string, stepId: string) => {
    try {
      await apiClient.updateOnboardingProgress(guideId, stepId, OnboardingStepStatus.IN_PROGRESS);
      refetch();
    } catch (error) {
      console.error('Failed to start guide:', error);
    }
  };

  const handleCompleteStep = async (guideId: string, stepId: string) => {
    try {
      await apiClient.updateOnboardingProgress(guideId, stepId, OnboardingStepStatus.COMPLETED);
      refetch();
    } catch (error) {
      console.error('Failed to complete step:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Onboarding Guides</h1>
        <p className="mt-2 text-gray-600">Step-by-step guides to get you started</p>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {guides?.map((guide) => (
          <Card key={guide.id} className="!p-0 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{guide.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{guide.description}</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <BookOpen className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {guide.estimatedTime} min
                </span>
                <span className="badge bg-purple-100 text-purple-800">
                  {guide.category}
                </span>
                {guide.isRequired && (
                  <span className="badge bg-red-100 text-red-800">Required</span>
                )}
              </div>
            </div>

            <div className="p-6">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-gray-900">{guide.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${guide.progress}%` }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {guide.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {step.status === OnboardingStepStatus.COMPLETED ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : step.status === OnboardingStepStatus.IN_PROGRESS ? (
                        <div className="w-5 h-5 border-2 border-primary-600 rounded-full border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center text-xs text-gray-500">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      {step.duration && (
                        <span className="text-xs text-gray-500 mt-1 inline-block">
                          ~{step.duration} min
                        </span>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {step.status === OnboardingStepStatus.PENDING && (
                        <button
                          onClick={() => handleStartGuide(guide.id, step.id)}
                          className="text-xs btn-primary py-1 px-3"
                        >
                          <Play className="h-3 w-3 inline mr-1" />
                          Start
                        </button>
                      )}
                      {step.status === OnboardingStepStatus.IN_PROGRESS && (
                        <button
                          onClick={() => handleCompleteStep(guide.id, step.id)}
                          className="text-xs btn-primary py-1 px-3"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {(!guides || guides.length === 0) && (
        <Card>
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No guides available</h3>
            <p className="text-sm text-gray-500">Check back later for onboarding content</p>
          </div>
        </Card>
      )}
    </div>
  );
};
