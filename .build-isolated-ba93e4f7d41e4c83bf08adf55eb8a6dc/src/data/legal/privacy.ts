import type { LegalDocument } from "@/types/legal";

// PROVISIONAL: This policy requires professional legal review before it is treated as final legal advice or approved legal copy.
export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  description: "Read the CBM Radio Privacy Policy and learn how information and third-party services are handled on the website.",
  introduction: "This policy explains, in general terms, how information may be handled when you visit and interact with the CBM Radio website.",
  effectiveDate: "6 August 2026",
  sections: [
    {
      id: "information",
      title: "Information associated with website use",
      paragraphs: [
        "The public website does not currently provide visitor accounts, purchases, newsletter registration, or an online contact form.",
        "As with most websites, hosting and network services may process technical request information needed to deliver pages and protect service availability. This can include an IP address, browser information, requested pages, and request times.",
      ],
    },
    {
      id: "communications",
      title: "Direct communications",
      paragraphs: [
        "The Contact page publishes business contact methods. If you contact CBM Radio by phone, email, or another external service, information you provide is handled through that communication channel rather than through a website contact form.",
        "Please provide only the information reasonably needed for your enquiry.",
      ],
    },
    {
      id: "storage",
      title: "Cookies and browser storage",
      paragraphs: [
        "The current public experience does not offer account or shopping functionality. The website platform, embedded services, or your browser may use technical storage that is necessary to provide their features.",
      ],
    },
    {
      id: "embedded-content",
      title: "Embedded content and third-party services",
      paragraphs: [
        "Some pages may display or open media supplied by YouTube or link to external social platforms. Loading or interacting with third-party content may allow that provider to receive technical information and apply its own privacy terms.",
        "CBM Radio does not control the privacy practices of external services. Review the provider's information before using its features.",
      ],
    },
    {
      id: "retention-security",
      title: "Retention and security",
      paragraphs: [
        "Information is retained only as operationally necessary or as required for the relevant communication or service. No specific retention period is promised by this provisional policy.",
        "Reasonable care is taken when operating the website, but no internet transmission or storage method can be represented as completely secure.",
      ],
    },
    {
      id: "external-links",
      title: "External links",
      paragraphs: [
        "The website may link to sites operated by other organisations. Their content, availability, and information practices are governed by their own terms and policies.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: [
        "This policy may be revised when website functionality or information-handling practices change. The effective date shown above will be updated deliberately when revised copy is published.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      contactReference: "For questions about this policy or the website's information practices, contact CBM Radio through the",
    },
  ],
};
