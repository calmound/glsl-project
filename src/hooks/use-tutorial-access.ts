'use client';

import { useEffect, useState } from 'react';
import { canAccessTutorial } from '@/lib/access-control';

interface UseTutorialAccessOptions {
  isFree: boolean;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
}

export function useTutorialAccess({
  isFree,
  isAuthenticated,
  hasActiveSubscription,
}: UseTutorialAccessOptions) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);

  const access = canAccessTutorial(isFree, hasActiveSubscription, isAuthenticated);
  const needsLogin = access.reason === 'not_logged_in';
  const needsSubscription = access.reason === 'subscription_required';

  useEffect(() => {
    if (needsLogin) {
      setShowLoginPrompt(true);
      setShowSubscriptionPrompt(false);
      return;
    }

    if (needsSubscription) {
      setShowLoginPrompt(false);
      setShowSubscriptionPrompt(true);
      return;
    }

    setShowLoginPrompt(false);
    setShowSubscriptionPrompt(false);
  }, [needsLogin, needsSubscription]);

  return {
    access,
    hasAccess: access.canAccess,
    needsLogin,
    needsSubscription,
    showLoginPrompt,
    setShowLoginPrompt,
    showSubscriptionPrompt,
    setShowSubscriptionPrompt,
  };
}
