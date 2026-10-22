import type { Metadata } from "next";
import LegalPage from "@/components/legal/legal-page";
import { privacyPolicy } from "@/data/legal/privacy";

export const metadata: Metadata = { title: "Privacy Policy | CBM Radio", description: privacyPolicy.description };
export default function PrivacyPage() { return <LegalPage document={privacyPolicy} />; }
