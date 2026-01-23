
import { useAdmin } from '@/lib/AdminProvider';

/**
 * Hook to retrieve live-editable content.
 * Falls back to defaultText if the key isn't found or provider is missing.
 */
export const useContent = (key, defaultText) => {
  // Hooks must be called at the top level, never inside try/catch or conditions
  const context = useAdmin();

  // Safely handle cases where context might be undefined (e.g. used outside provider)
  if (!context || !context.siteContent) {
    return defaultText;
  }

  const { siteContent } = context;
  return siteContent[key] !== undefined ? siteContent[key] : defaultText;
};
