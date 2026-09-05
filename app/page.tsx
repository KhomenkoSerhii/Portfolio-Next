import Hero from "@/components/sections/Hero";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Recommendations from "@/components/sections/Recommendations";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import ChatWidget from "@/components/chat/ChatWidget";
import SceneMount from "@/components/three/SceneMount";
import Navbar from "@/components/layout/Navbar";
import EasterEggs from "@/components/easter/EasterEggs";
import { profile, experience } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Senior Frontend Engineer",
  description: profile.summary,
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lviv",
    addressCountry: "UA",
  },
  sameAs: [profile.links.linkedin, profile.links.github, profile.links.telegram],
  worksFor: {
    "@type": "Organization",
    name: experience[0].company,
  },
  knowsAbout: [
    "React",
    "TypeScript",
    "Next.js",
    "JavaScript",
    "LLM integration",
    "Prompt engineering",
    "Node.js",
    "Web3",
  ],
};

export default function Home() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <SceneMount />
      <Navbar />
      <div id="page-content">
        <Hero />
        <Experience />
        <Skills />
        <Projects />
        <Recommendations />
        <Services />
        <Contact />
      </div>
      <ChatWidget />
      <EasterEggs />
    </main>
  );
}
