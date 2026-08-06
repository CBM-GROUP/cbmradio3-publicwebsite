import type { LegalDocument } from "@/types/legal";

// PROVISIONAL: These terms require professional legal review, including approved jurisdiction and liability language.
export const termsOfUse: LegalDocument = {
  title: "Terms of Use",
  description: "Read the terms governing access to and use of the CBM Radio website.",
  introduction: "These provisional terms describe the general conditions for accessing and using the CBM Radio public website.",
  effectiveDate: "6 August 2026",
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of these terms",
      paragraphs: [
        "By using this website, you agree to use it responsibly and in accordance with these terms. If you do not agree, you should discontinue use of the website.",
      ],
    },
    {
      id: "permitted-use",
      title: "Use of the website",
      paragraphs: ["The website provides public radio, programme, episode, news, gallery, team, and business contact information."],
      items: [
        "Do not attempt to disrupt, damage, or gain unauthorised access to the website or its supporting systems.",
        "Do not use the website to distribute malicious code or unlawful material.",
        "Do not misrepresent your association with CBM Radio or another person.",
      ],
    },
    {
      id: "content",
      title: "Website content",
      paragraphs: [
        "Website material is provided for general information, cultural programming, education, and entertainment. Content may be corrected, updated, rescheduled, or removed without guaranteeing continuous availability.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      paragraphs: [
        "Text, branding, images, audio, video, and other material may be protected by intellectual-property rights belonging to CBM Radio, contributors, licensors, or other rights holders. These terms do not transfer those rights to visitors.",
        "Do not reproduce or commercially exploit protected material without appropriate permission or another lawful basis.",
      ],
    },
    {
      id: "media-and-links",
      title: "Embedded media and external links",
      paragraphs: [
        "The website may display YouTube media and links to external platforms. Third-party services operate under their own terms, privacy practices, and availability conditions. A link does not by itself represent control of or responsibility for an external service.",
      ],
    },
    {
      id: "comments",
      title: "Comments and submissions",
      paragraphs: [
        "Where public commenting is made available, submissions may be moderated before appearing. Visitors should not submit unlawful, abusive, infringing, deceptive, or unnecessarily personal information.",
        "The current Contact page provides direct contact methods and does not contain an online enquiry form.",
      ],
    },
    {
      id: "availability",
      title: "Accuracy and availability",
      paragraphs: [
        "Reasonable efforts may be made to keep public information useful and current, but the website is not represented as error-free, complete, or continuously available. Visitors should independently confirm information where timing or accuracy is important.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      paragraphs: [
        "These terms may be revised as the website changes or after professional review. The effective date will be updated deliberately when revised terms are published.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      contactReference: "For questions concerning these terms, contact CBM Radio through the",
    },
  ],
};
