import { useContext } from 'react';
import { CVContext } from '../context/CVContext';
import type { CVContextType } from '../context/CVContext';

export function useCV(): CVContextType {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
}
