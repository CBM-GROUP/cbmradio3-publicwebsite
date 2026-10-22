import { Camera, GalleryHorizontalEnd, Video } from "lucide-react";

export const mediaTabs = [
  {
    id: "all",
    label: "All media",
    icon: GalleryHorizontalEnd,
  },
  {
    id: "photo",
    label: "Photos",
    icon: Camera,
  },
  {
    id: "video",
    label: "Videos",
    icon: Video,
  },
] as const;