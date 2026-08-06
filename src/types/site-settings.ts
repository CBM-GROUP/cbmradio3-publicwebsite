export type SocialPlatformKey =
  | "facebook"
  | "instagram"
  | "youtube"
  | "x"
  | "linkedin"
  | "tiktok"
  | "whatsapp";

export interface SocialLink {
  id: number;
  platform_key: SocialPlatformKey;
  platform_label: string;
  url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteContact {
  business_phone: string;
  business_email: string;
  physical_address: string;
  updated_at: string;
}