import { Agents } from "@/components/Agents";
import { Anshap } from "@/components/Anshap";
import { CommandPalette } from "@/components/CommandPalette";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Inflection } from "@/components/Inflection";
import { Journey } from "@/components/Journey";
import { Life } from "@/components/Life";
import { Nav } from "@/components/Nav";
import { Origins } from "@/components/Origins";
import { Pulse } from "@/components/Pulse";
import { Spotlight } from "@/components/Spotlight";
import { UniverseMount } from "@/components/three/UniverseMount";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <UniverseMount />
      <Nav />
      <CommandPalette />
      <Spotlight />
      <main className="relative">
        <Hero />
        <Journey />
        <Origins />
        <Inflection />
        <Work />
        <Anshap />
        <Agents />
        <Life />
        <Pulse />
        <Contact />
      </main>
    </>
  );
}
