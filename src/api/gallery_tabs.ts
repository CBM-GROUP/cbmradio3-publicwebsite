import { Calendar, Grid, ImageIcon, Mic, Users } from "lucide-react";

export const galleryTabs = [
  { id: "all", label: "All", icon: Grid },
  { id: "events", label: "Event", icon: Calendar },
  { id: "studio", label: "Studio", icon: Mic },
  { id: "team", label: "Team", icon: Users },
  { id: "general", label: "General", icon: ImageIcon },
] as const;