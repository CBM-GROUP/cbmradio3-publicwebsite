"use client";

import React from "react";
import StationDispatchesFlatLay from "@/components/station-dispatches-flatlay";
import TheWireSection from "@/components/the-wire-section";

export default function NewsSection() {
  return (
    <div id="news-wire-container" className="relative">
      {/* 01 // Stories, Culture & Station Dispatches: Top-Down Flat Lay on Dark Stage */}
      <section className="relative scroll-mt-20 border-b-2 border-black bg-[#04b093] px-5 py-14 text-black sm:px-8 sm:py-18 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <StationDispatchesFlatLay />
        </div>
      </section>

      {/* 02 // The Wire: Full Editorial Articles & Releases, Magazine Layout, Ticker & Reader Overlay */}
      <TheWireSection />
    </div>
  );
}
