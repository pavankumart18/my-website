import { Chapter } from "./Chapter";
import { NeuralJourney } from "./journey/NeuralJourney";
import { Reveal } from "./Reveal";

export function Journey() {
  return (
    <Chapter
      id="journey"
      index="00"
      kicker="Prologue · the network I grew"
      title={
        <>
          Every project trained the next. <em className="font-serif font-normal italic text-aurora">Watch it grow.</em>
        </>
      }
      lede="Each glowing neuron is a technology I've learned; each line is something I shipped with it. Three tracks run in parallel: learning at CBIT, building Anshap since March 2024, and client AI at Straive. Press play to hear it."
    >
      <Reveal>
        <NeuralJourney />
      </Reveal>
    </Chapter>
  );
}
