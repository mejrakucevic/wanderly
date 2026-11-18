import { router, type Href } from 'expo-router';

/**
 * Goes back one screen, or to `fallback` when there is nothing to go back to
 * (e.g. after reloading the page on web, or opening a screen from a link).
 */
export function goBack(fallback: Href = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}
