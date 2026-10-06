import { lifeIntro } from "@/content/life";
import { Chapter } from "./Chapter";
import { Dancer } from "./life/Dancer";
import { LogicGame } from "./life/LogicGame";
import { Piano } from "./life/Piano";
import { Sketchpad } from "./life/Sketchpad";
import { TravelMap } from "./life/TravelMap";
import { Reveal } from "./Reveal";

export function Life() {
  return (
    <Chapter
      id="life"
      index="06"
      kicker="Off the clock"
      title={
        <>
          The same person, <em className="font-serif font-normal italic text-aurora">away from the keyboard.</em>
        </>
      }
      lede={lifeIntro}
    >
      <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
        <Reveal className="min-w-0">
          <TravelMap />
        </Reveal>
        <Reveal delay={0.08} className="flex min-w-0 flex-col [&>*]:flex-1">
          <Dancer />
        </Reveal>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Reveal className="min-w-0">
          <Piano />
        </Reveal>
        <Reveal delay={0.08} className="min-w-0">
          <Sketchpad />
        </Reveal>
      </div>
      <Reveal className="mt-5">
        <LogicGame />
      </Reveal>
      <Reveal className="mt-10">
        <p className="max-w-2xl font-serif text-2xl italic leading-snug text-text/80">
          None of these make me money. All of them make me better at the work that does.
        </p>
      </Reveal>
    </Chapter>
  );
}
