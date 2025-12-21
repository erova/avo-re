'use client';

import { useState, useEffect, useCallback } from 'react';
import { OnboardingEngine, OnboardingStep, ChecklistItem, OnboardingEvent } from './onboarding-engine';

export function useOnboarding(engine: OnboardingEngine) {
  const [isActive, setIsActive] = useState(engine.isFlowActive());
  const [currentStep, setCurrentStep] = useState<OnboardingStep | null>(engine.getCurrentStep());
  const [stepIndex, setStepIndex] = useState(engine.getCurrentStepIndex());
  const [checklist, setChecklist] = useState<ChecklistItem[]>(engine.getChecklistState());
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleFlowStarted = (event: OnboardingEvent) => {
      setIsActive(true);
      setCurrentStep(engine.getCurrentStep());
      setStepIndex(engine.getCurrentStepIndex());
    };

    const handleStepChanged = (event: OnboardingEvent) => {
      setCurrentStep(engine.getCurrentStep());
      setStepIndex(engine.getCurrentStepIndex());
    };

    const handleFlowCompleted = (event: OnboardingEvent) => {
      setIsActive(false);
      setCurrentStep(null);
    };

    const handleFlowSkipped = (event: OnboardingEvent) => {
      setIsActive(false);
      setCurrentStep(null);
    };

    const handleChecklistUpdated = (event: OnboardingEvent) => {
      setChecklist(engine.getChecklistState());
    };

    engine.on('flow_started', handleFlowStarted);
    engine.on('step_changed', handleStepChanged);
    engine.on('flow_completed', handleFlowCompleted);
    engine.on('flow_skipped', handleFlowSkipped);
    engine.on('checklist_updated', handleChecklistUpdated);

    return () => {
      engine.off('flow_started', handleFlowStarted);
      engine.off('step_changed', handleStepChanged);
      engine.off('flow_completed', handleFlowCompleted);
      engine.off('flow_skipped', handleFlowSkipped);
      engine.off('checklist_updated', handleChecklistUpdated);
    };
  }, [engine]);

  const startFlow = useCallback((flowId: string) => {
    engine.startFlow(flowId);
  }, [engine]);

  const nextStep = useCallback(() => {
    engine.nextStep();
  }, [engine]);

  const skipFlow = useCallback(() => {
    engine.skipFlow();
  }, [engine]);

  const completeChecklistItem = useCallback((itemId: string) => {
    engine.completeChecklistItem(itemId);
  }, [engine]);

  const reset = useCallback(() => {
    engine.reset();
    forceUpdate({});
  }, [engine]);

  return {
    isActive,
    currentStep,
    stepIndex,
    checklist,
    helpIndicators: engine.getHelpIndicators(),
    startFlow,
    nextStep,
    skipFlow,
    completeChecklistItem,
    reset,
    totalSteps: engine.getCurrentFlow()?.steps.length || 0,
    completedSteps: engine.getCompletedSteps(),
  };
}