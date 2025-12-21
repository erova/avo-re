'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChecklistPanelProps {
  items: Array<{
    id: string;
    label: string;
    completed: boolean;
  }>;
  onComplete: (id: string) => void;
}

export function ChecklistPanel({ items, onComplete }: ChecklistPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastCompleted, setLastCompleted] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  
  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;

  useEffect(() => {
    if (completedCount > lastCompleted) {
      const remaining = totalCount - completedCount;
      
      let message = '';
      if (remaining === 0) {
        message = "That's it—you've tried everything!";
      } else if (remaining === 1) {
        message = "1 more to go!";
      } else {
        message = `${remaining} more to go!`;
      }
      
      setToastMessage(message);
      setShowToast(true);
      setLastCompleted(completedCount);
      setTimeout(() => setShowToast(false), 4000); // Increased from 3000 to 4000
    }
  }, [completedCount, lastCompleted, totalCount]);

  if (totalCount === 0) return null;

  return (
    <>
      {/* Toast - bottom right near checklist */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-[10000] bg-neutral-800/90 backdrop-blur-sm border border-neutral-700/50 rounded-lg px-6 py-3 shadow-xl"
          >
            <div className="text-[rgb(var(--accent))] font-medium text-sm">
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating panel - bottom right */}
      <div className="fixed bottom-6 right-6 z-[9996] w-80">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl">
          {/* Collapsed bar */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-800/50 transition rounded-lg"
          >
            <span className="text-sm text-neutral-300">
              Onboarding Checklist: <span className="text-[rgb(var(--accent))] font-medium">{completedCount}/{totalCount}</span>
            </span>
            <ChevronUp 
              size={16} 
              className={`text-neutral-400 transition-transform ${isExpanded ? '' : 'rotate-180'}`}
            />
          </button>

          {/* Expanded list */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border-t border-neutral-800 px-4 py-3">
                  <div className="text-xs font-medium mb-3 text-neutral-400 uppercase">
                    Tasks to Complete
                  </div>
                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        <span className="text-neutral-500 w-4">{idx + 1}.</span>
                        {item.completed ? (
                          <>
                            <Check size={16} className="text-[rgb(var(--accent))]" />
                            <span className="text-neutral-500 line-through">{item.label}</span>
                          </>
                        ) : (
                          <button
                            onClick={() => onComplete(item.id)}
                            className="text-neutral-300 hover:text-[rgb(var(--accent))] transition text-left"
                          >
                            {item.label}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}