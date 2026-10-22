import type { Metadata } from "next";
import LegalPage from "@/components/legal/legal-page";
import { termsOfUse } from "@/data/legal/terms";

export const metadata: Metadata = { title: "Terms of Use | CBM Radio", description: termsOfUse.description };
export default function TermsPage() { return <LegalPage document={termsOfUse} />; }
