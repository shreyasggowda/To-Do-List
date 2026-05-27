import { useEffect, useEffectEvent } from "react";

interface KeyboardShortcutsOptions {
  onOpenCommandPalette: () => void;
  onCreateTask: () => void;
  onGoToDashboard: () => void;
  onGoToTasks: () => void;
  onToggleTheme: () => void;
}

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable);

export const useKeyboardShortcuts = ({
  onOpenCommandPalette,
  onCreateTask,
  onGoToDashboard,
  onGoToTasks,
  onToggleTheme,
}: KeyboardShortcutsOptions) => {
  // useEffectEvent keeps the listener stable while still reading the latest
  // callbacks, which avoids stale closures without re-binding on every render.
  const onOpenPaletteEvent = useEffectEvent(onOpenCommandPalette);
  const onCreateTaskEvent = useEffectEvent(onCreateTask);
  const onGoToDashboardEvent = useEffectEvent(onGoToDashboard);
  const onGoToTasksEvent = useEffectEvent(onGoToTasks);
  const onToggleThemeEvent = useEffectEvent(onToggleTheme);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenPaletteEvent();
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        onCreateTaskEvent();
      }

      if (event.key.toLowerCase() === "g") {
        event.preventDefault();
        onGoToDashboardEvent();
      }

      if (event.key.toLowerCase() === "t") {
        if (event.shiftKey) {
          event.preventDefault();
          onToggleThemeEvent();
          return;
        }

        event.preventDefault();
        onGoToTasksEvent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onCreateTaskEvent,
    onGoToDashboardEvent,
    onGoToTasksEvent,
    onOpenPaletteEvent,
    onToggleThemeEvent,
  ]);
};
