import { useSyncExternalStore } from "react";

export function useMedia(query: string) {
  const subscribe = (callback: () => void) => {
    const media = window.matchMedia(query);

    media.addEventListener("change", callback);

    return () => {
      media.removeEventListener("change", callback);
    };
  };

  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => {
    return false;
  };

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
}