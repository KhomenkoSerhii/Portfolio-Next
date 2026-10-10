import Hero from "@/components/sections/Hero";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Portfolio from "@/components/sections/Portfolio";
import PullQuote from "@/components/sections/PullQuote";
import Recommendations from "@/components/sections/Recommendations";
import Contact from "@/components/sections/Contact";
import Navbar from "@/components/layout/Navbar";
import { profile, experience } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  description: profile.summary,
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lviv",
    addressCountry: "UA",
  },
  sameAs: [profile.links.linkedin, profile.links.telegram],
  worksFor: {
    "@type": "Organization",
    name: experience[0].company,
  },
  knowsAbout: [
    "React",
    "TypeScript",
    "Next.js",
    "JavaScript",
    "Node.js",
    "REST APIs",
    "MongoDB",
    "Socket.IO",
    "Full-stack development",
    "LLM integration",
    "Prompt engineering",
    "Web3",
  ],
};

export default function Home() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <div id="page-content">
        <Hero />
        <PullQuote />
        <Experience />
        <Portfolio />
        <Skills />
        <Recommendations />
        <Contact />
      </div>
    </main>
  );
}
