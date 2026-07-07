import Nav from "./components/Nav";
import Hero from "./components/Hero";
import VerticalJourney from "./components/VerticalJourney";
import WhatWeBuild from "./components/WhatWeBuild";
import Sections from "./components/Sections";
import GuideChat from "./components/GuideChat";
import ScrollCompass from "./components/ScrollCompass";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero now carries the full opening: vista -> map unfolds -> map draws
            itself -> "you are here", all as one continuous pinned shot. */}
        <Hero />
        <VerticalJourney />
        <WhatWeBuild />
        <Sections />
      </main>
      <GuideChat />
      <ScrollCompass />
    </>
  );
}
