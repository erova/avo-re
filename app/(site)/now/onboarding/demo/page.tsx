'use client';

import { useState } from 'react';
import { Zap, Settings, Bell, Database, Users, BarChart, FileText } from 'lucide-react';
import { ChecklistPanel } from './ChecklistPanel';
import { HelpIndicator } from './HelpIndicator';
import { OnboardingTooltip } from './OnboardingTooltip';
import { createOnboardingEngine, OnboardingConfig } from './onboarding-engine';
import { useOnboarding } from './useOnboarding';

// Tour configuration
const tourConfig: OnboardingConfig = {
  helpIndicators: [],
  flows: [
    {
      id: 'dashboard-tour',
      name: 'Dashboard Tour',
      steps: [
        {
          id: 'header',
          target: '#app-header',
          title: 'Welcome to Dashboard',
          content: 'This simulates a complex enterprise dashboard. Notice the pulsing dot and triangle arrow pointing to this element.',
          position: 'bottom',
          action: 'Start Tour',
          highlight: true
        },
        {
          id: 'analytics',
          target: '#nav-dashboard',
          title: 'Analytics Dashboard',
          content: 'View real-time metrics and KPIs. Watch how the chart transforms your data.',
          position: 'right',
          action: 'Next',
          gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXN1aWN0YzJkNHFnOWh3dmZtcW5wZDd1OW1oaG1haWUycGZ2dWczNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oKIPEqDGUULpEU0aQ/giphy.gif'
        },
        {
          id: 'quick-action',
          target: '#quick-action-btn',
          title: 'Quick Actions',
          content: 'Common tasks are one click away. This tooltip appears directly below the button.',
          position: 'bottom',
          action: 'Next'
        },
        {
          id: 'notifications',
          target: '#notifications-btn',
          title: 'Notifications',
          content: 'Stay updated with real-time alerts.',
          position: 'bottom',
          action: 'Finish'
        }
      ],
      checklist: []
    }
  ]
};

// Initialize tour engine
const tourEngine = createOnboardingEngine(tourConfig);

export default function OnboardingDemoPage() {
  // Tour state
  const tour = useOnboarding(tourEngine);
  
  // Checklist state (separate from tour)
  const [checklist, setChecklist] = useState([
    { id: 'data-source', label: 'Connect a data source', completed: false },
    { id: 'analytics', label: 'Review analytics dashboard', completed: false },
    { id: 'team-member', label: 'Grant access to a team member', completed: false },
    { id: 'share-report', label: 'Share a report', completed: false },
  ]);

  const markComplete = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: true } : item
    ));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      
      {/* Site Navigation Area */}
      <div className="border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <a 
            href="/now/onboarding" 
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-[rgb(var(--accent))] transition"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Article
          </a>
        </div>
      </div>

      {/* Demo Introduction */}
      <div className="bg-neutral-950 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-medium tracking-tight mb-3">
            Interactive Demo
          </h1>
          <p className="text-neutral-400 mb-6">
            Click "Start Dashboard Tour" to see tooltips with GIFs, or click the (!) badges to complete the onboarding checklist.
          </p>

          {/* Demo Controls */}
          <div className="flex gap-4">
            <button
              onClick={() => tour.startFlow('dashboard-tour')}
              className="px-6 py-3 bg-[rgb(var(--accent)/0.18)] text-[rgb(var(--accent))] border border-[rgb(var(--accent)/0.35)] rounded-lg font-medium hover:opacity-90 transition"
            >
              Start Dashboard Tour
            </button>

            <button
              onClick={() => tour.reset()}
              className="px-6 py-3 bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-lg font-medium hover:bg-neutral-700 transition"
            >
              Reset Tour
            </button>
          </div>
        </div>
      </div>

      {/* Demo Container - Visually Separated */}
      <div className="bg-neutral-900 min-h-screen">
        <div className="max-w-7xl mx-auto p-8">
          {/* Demo Frame */}
          <div className="bg-neutral-950 border-2 border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
            
            {/* Help Indicators */}
            <div className="relative">
              <HelpIndicator targetSelector="#feature-data-source" onClick={() => markComplete('data-source')} />
              <HelpIndicator targetSelector="#feature-analytics" onClick={() => markComplete('analytics')} />
              <HelpIndicator targetSelector="#feature-team-management" onClick={() => markComplete('team-member')} />
              <HelpIndicator targetSelector="#feature-quick-actions" onClick={() => markComplete('share-report')} />

              {/* Simulated Enterprise Dashboard */}
              <header id="app-header" className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between bg-neutral-950">
                <div className="flex items-center gap-8">
                  <div className="font-semibold text-lg">EnterpriseDash</div>
                  <nav className="flex gap-6 text-sm text-neutral-400">
                    <a href="#" id="nav-dashboard" className="hover:text-neutral-100 transition flex items-center gap-2">
                      <BarChart size={16} />
                      Dashboard
                    </a>
                    <a href="#" className="hover:text-neutral-100 transition flex items-center gap-2">
                      <Users size={16} />
                      Team
                    </a>
                    <a href="#" className="hover:text-neutral-100 transition flex items-center gap-2">
                      <FileText size={16} />
                      Reports
                    </a>
                  </nav>
                </div>

                <div className="flex items-center gap-3">
                  <button id="quick-action-btn" className="px-4 py-2 bg-[rgb(var(--accent)/0.18)] text-[rgb(var(--accent))] border border-[rgb(var(--accent)/0.35)] rounded-lg text-sm font-medium hover:opacity-90 transition flex items-center gap-2">
                    <Zap size={16} />
                    Quick Action
                  </button>
                  <button id="notifications-btn" className="p-2 hover:bg-neutral-800 rounded-lg transition relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[rgb(var(--accent))] rounded-full"></span>
                  </button>
                  <button id="settings-btn" className="p-2 hover:bg-neutral-800 rounded-lg transition">
                    <Settings size={20} />
                  </button>
                </div>
              </header>

              {/* Dashboard Content */}
              <div className="p-8 pb-32 bg-neutral-950">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-medium mb-6">Click Features to Complete Checklist</h2>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <button
                      id="feature-data-source"
                      onClick={() => markComplete('data-source')}
                      className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition text-left group"
                    >
                      <Database className="mb-3 text-[rgb(var(--accent))] group-hover:scale-110 transition" size={24} />
                      <div className="font-medium mb-1">Data Source</div>
                      <div className="text-sm text-neutral-400">Connect databases</div>
                    </button>

                    <button
                      id="feature-analytics"
                      onClick={() => markComplete('analytics')}
                      className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition text-left group"
                    >
                      <BarChart className="mb-3 text-[rgb(var(--accent))] group-hover:scale-110 transition" size={24} />
                      <div className="font-medium mb-1">Analytics</div>
                      <div className="text-sm text-neutral-400">View metrics</div>
                    </button>

                    <button
                      id="feature-team-management"
                      onClick={() => markComplete('team-member')}
                      className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition text-left group"
                    >
                      <Users className="mb-3 text-[rgb(var(--accent))] group-hover:scale-110 transition" size={24} />
                      <div className="font-medium mb-1">Team Management</div>
                      <div className="text-sm text-neutral-400">Manage team</div>
                    </button>

                    <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl">
                      <FileText className="mb-3 text-neutral-600" size={24} />
                      <div className="font-medium mb-1 text-neutral-600">Reports</div>
                      <div className="text-sm text-neutral-600">Generate insights</div>
                    </div>

                    <button
                      id="feature-quick-actions"
                      onClick={() => markComplete('share-report')}
                      className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition text-left group"
                    >
                      <Zap className="mb-3 text-[rgb(var(--accent))] group-hover:scale-110 transition" size={24} />
                      <div className="font-medium mb-1">Quick Actions</div>
                      <div className="text-sm text-neutral-400">Common workflows</div>
                    </button>

                    <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl">
                      <Settings className="mb-3 text-neutral-600" size={24} />
                      <div className="font-medium mb-1 text-neutral-600">Configuration</div>
                      <div className="text-sm text-neutral-600">Customize settings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Tooltip */}
      {tour.isActive && tour.currentStep && (
        <OnboardingTooltip
          step={tour.currentStep}
          stepIndex={tour.stepIndex}
          totalSteps={tour.totalSteps}
          completedSteps={tour.completedSteps}
          onNext={tour.nextStep}
          onSkip={tour.skipFlow}
        />
      )}

      {/* Checklist */}
      <ChecklistPanel items={checklist} onComplete={markComplete} />
    </div>
  );
}