'use client';

import React, { useEffect, useState } from 'react';
import App from '../../src/App';
import { getAcceptedMissionsAction } from '@/app/actions';
import type { Mission } from '../../src/types/mission';

export default function OperativesClient({
  initialServerMissions = [],
}: {
  initialServerMissions?: Mission[];
}) {
  const [serverMissions, setServerMissions] = useState<Mission[]>(initialServerMissions);

  useEffect(() => {
    // Re-verify on client mount in case missions were accepted without page reload
    getAcceptedMissionsAction()
      .then((data) => {
        if (data && data.length > 0) {
          setServerMissions(data);
        }
      })
      .catch((err) => console.error('Failed to sync accepted missions:', err));
  }, []);

  return <App serverMissions={serverMissions} />;
}
