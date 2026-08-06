import type { SocialPlatformKey } from "@/types/site-settings";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOCIAL_PLATFORMS = new Set<SocialPlatformKey>([
  "facebook", "instagram", "youtube", "x", "linkedin", "tiktok", "whatsapp",
]);

export function getPhoneHref(value: string) {
  const display = value.trim();
  if (!display || !/^\+?[0-9\s\-()]{7,25}$/.test(display)) return null;
  const digits = display.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return null;
  return "tel:" + (display.startsWith("+") ? "+" : "") + digits;
}

export function getEmailHref(value: string) {
  const email = value.trim();
  return EMAIL_PATTERN.test(email) ? "mailto:" + email : null;
}

export function getSafeSocialUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

export function isSupportedSocialPlatform(value: string): value is SocialPlatformKey {
  return SOCIAL_PLATFORMS.has(value as SocialPlatformKey);
}
