'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createBrowserSupabase } from '@/lib/supabase';
import { savePendingCode, getPendingCode, clearPendingCode } from '@/lib/code-storage';

interface UseTutorialCodePersistenceOptions {
  tutorialId: string;
  exerciseCode: string;
  user: User | null;
  restoreMessage: string;
  addToast: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
}

export function useTutorialCodePersistence({
  tutorialId,
  exerciseCode,
  user,
  restoreMessage,
  addToast,
}: UseTutorialCodePersistenceOptions) {
  const supabase = createBrowserSupabase();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchedOnceRef = useRef(false);
  const latestUserCodeRef = useRef(exerciseCode);

  const [userCode, setUserCode] = useState(exerciseCode);
  const [initialCode, setInitialCode] = useState(exerciseCode);

  useEffect(() => {
    latestUserCodeRef.current = userCode;
  }, [userCode]);

  useEffect(() => {
    setUserCode(exerciseCode);
    setInitialCode(exerciseCode);
    latestUserCodeRef.current = exerciseCode;
  }, [exerciseCode, tutorialId]);

  useEffect(() => {
    if (fetchedOnceRef.current) return;
    fetchedOnceRef.current = true;

    (async () => {
      try {
        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !currentUser) {
          return;
        }

        const { data, error } = await supabase
          .from('user_form_code')
          .select('code_content')
          .eq('form_id', tutorialId)
          .eq('user_id', currentUser.id)
          .maybeSingle();

        if (error || !data?.code_content) {
          return;
        }

        if (data.code_content !== latestUserCodeRef.current) {
          setUserCode(data.code_content);
          setInitialCode(data.code_content);
          latestUserCodeRef.current = data.code_content;
        }
      } catch (error) {
        console.error('Failed to load saved tutorial code:', error);
      }
    })();
  }, [supabase, tutorialId]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const savedCode = getPendingCode(tutorialId);
    if (!savedCode) {
      return;
    }

    setUserCode(savedCode);
    latestUserCodeRef.current = savedCode;
    addToast(restoreMessage, 'success', 3000);
    clearPendingCode(tutorialId);
  }, [user, tutorialId, restoreMessage, addToast]);

  const saveCodeToDatabase = useCallback(
    async (code: string) => {
      try {
        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !currentUser) {
          return;
        }

        const { error } = await supabase.from('user_form_code').upsert(
          {
            user_id: currentUser.id,
            form_id: tutorialId,
            code_content: code,
            language: 'glsl',
            is_draft: true,
          },
          {
            onConflict: 'user_id,form_id',
            ignoreDuplicates: false,
          }
        );

        if (error) {
          console.error('Failed to save tutorial code:', error);
        }
      } catch (error) {
        console.error('Unexpected error while saving tutorial code:', error);
      }
    },
    [supabase, tutorialId]
  );

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void saveCodeToDatabase(userCode);
    }, 5000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [userCode, saveCodeToDatabase]);

  const handleEditorBlur = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    void saveCodeToDatabase(userCode);
  }, [userCode, saveCodeToDatabase]);

  return {
    userCode,
    setUserCode,
    initialCode,
    setInitialCode,
    handleEditorBlur,
    persistPendingCode: savePendingCode,
  };
}
