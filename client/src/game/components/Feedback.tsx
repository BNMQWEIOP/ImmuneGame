import React, { useEffect, useState } from 'react';
import { useImmuneSystem } from '../../lib/stores/useImmuneSystem';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useAudio } from '@/lib/stores/useAudio';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Feedback() {
  const { responseHistory, gamePhase } = useImmuneSystem();
  const { playSuccess, playHit } = useAudio();
  const [lastFeedback, setLastFeedback] = useState<{
    correct: boolean;
    message: string;
    timestamp: number;
  } | null>(null);
  
  // Update feedback when responseHistory changes
  useEffect(() => {
    if (responseHistory.length > 0) {
      const latest = responseHistory[responseHistory.length - 1];
      
      if (latest.correct) {
        playSuccess();
      } else {
        playHit();
      }
      
      setLastFeedback({
        correct: latest.correct,
        message: latest.message,
        timestamp: Date.now()
      });
      
      // Auto-hide feedback after 4 seconds
      const timer = setTimeout(() => {
        setLastFeedback(null);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [responseHistory, playSuccess, playHit]);
  
  // Don't show feedback if not in playing phase
  if (gamePhase !== 'playing') {
    return null;
  }
  
  return (
    <AnimatePresence>
      {lastFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-md"
        >
          <Alert variant={lastFeedback.correct ? "default" : "destructive"} className="border-4">
            <div className="flex items-start gap-4">
              {lastFeedback.correct ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6" />
              )}
              <div>
                <AlertTitle className="text-lg">
                  {lastFeedback.correct ? "Correct Response!" : "Incorrect Sequence"}
                </AlertTitle>
                <AlertDescription className="mt-1">
                  {lastFeedback.message}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
