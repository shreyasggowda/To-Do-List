import { BriefcaseBusiness, LayoutDashboard, LogOut, MoonStar, Plus, SunMedium } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

interface AppCommandPaletteProps {
  open: boolean;
  isDarkMode: boolean;
  onOpenChange: (value: boolean) => void;
  onCreateTask: () => void;
  onGoToDashboard: () => void;
  onGoToTasks: () => void;
  onToggleTheme: () => void;
  onSignOut: () => void;
}

export const AppCommandPalette = ({
  open,
  isDarkMode,
  onOpenChange,
  onCreateTask,
  onGoToDashboard,
  onGoToTasks,
  onToggleTheme,
  onSignOut,
}: AppCommandPaletteProps) => (
  <CommandDialog open={open} onOpenChange={onOpenChange}>
    <CommandInput placeholder="Search commands or jump to a workspace..." />
    <CommandList>
      <CommandEmpty>No matching command found.</CommandEmpty>
      <CommandGroup heading="Navigate">
        <CommandItem onSelect={onGoToDashboard}>
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
          <CommandShortcut>G</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={onGoToTasks}>
          <BriefcaseBusiness className="h-4 w-4" />
          Task board
          <CommandShortcut>T</CommandShortcut>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Actions">
        <CommandItem onSelect={onCreateTask}>
          <Plus className="h-4 w-4" />
          New task
          <CommandShortcut>N</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={onToggleTheme}>
          {isDarkMode ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          Toggle theme
          <CommandShortcut>Shift T</CommandShortcut>
        </CommandItem>

        <CommandItem onSelect={onSignOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <div className="px-4 py-3 text-xs text-muted-foreground">
        Press <span className="rounded bg-white/10 px-2 py-1 text-foreground">Cmd/Ctrl + K</span> any time.
      </div>
    </CommandList>
  </CommandDialog>
);
