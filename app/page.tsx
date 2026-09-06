import Hero from "@/components/sections/Hero";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Recommendations from "@/components/sections/Recommendations";
import GitHubActivity from "@/components/sections/GitHubActivity";
import Contact from "@/components/sections/Contact";
import Navbar from "@/components/layout/Navbar";
import { profile, experience } from "@/lib/data";
import { getGitHubActivity, githubUsername } from "@/lib/github";
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

export default async function Home() {
  const activity = await getGitHubActivity();

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
        <Projects />
        <GitHubActivity activity={activity} username={githubUsername} />
        <Experience />
        <Skills />
        <Recommendations />
        <Contact />
      </div>
    </main>
  );
}
