"use client";

import { useEffect, useRef, useState, useCallback, useId } from "react";
import Image, { StaticImageData } from "next/image";
import { Play, Pause, Volume2, VolumeX, Radio, Sparkles } from "lucide-react";

// =========================================================================
// STREAM CONFIGURATION
// Replace STREAM_URL with your live CBM Radio audio stream endpoint:
// =========================================================================
export const STREAM_URL = "https://stream.zeno.fm/f3wvbbqmdg8uv";

export interface TurntablePlayerProps {
  nowPlayingTitle?: string;
  nowPlayingSubtitle?: string;
  coverImage?: string | StaticImageData;
  streamUrl?: string;
  className?: string;
}

export default function TurntablePlayer({
  nowPlayingTitle = "CBM Radio 24/7 Live Broadcast",
  nowPlayingSubtitle = "Original Shows, Culture & African Sound",
  coverImage,
  streamUrl = STREAM_URL,
  className = "",
}: TurntablePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75); // 0 to 1
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState<33 | 45>(33);
  const [vuAngle, setVuAngle] = useState(-38); // -38deg (idle) to +28deg (peak)
  const [isDraggingKnob, setIsDraggingKnob] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const vinylRef = useRef<HTMLDivElement | null>(null);
  const knobRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const vuIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Physics-based rotation tracking for smooth deceleration
  const rotationRef = useRef<number>(0);
  const velocityRef = useRef<number>(0); // deg/sec
  const lastTimeRef = useRef<number>(0);

  // Target velocity: 33 1/3 RPM = 200 deg/sec; 45 RPM = 270 deg/sec
  const targetVelocity = isPlaying ? (speed === 33 ? 200 : 270) : 0;

  // Animation loop: spin up when playing, gradually decelerate when paused
  useEffect(() => {
    let active = true;

    const tick = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const target = isPlaying ? (speed === 33 ? 200 : 270) : 0;
      // Exponential smoothing for realistic inertia spin-up & spin-down
      if (isPlaying) {
        // Accelerate up smoothly
        velocityRef.current += (target - velocityRef.current) * Math.min(dt * 3.2, 1);
      } else {
        // Natural friction coast-down
        velocityRef.current *= Math.pow(0.55, dt);
        if (velocityRef.current < 0.5) velocityRef.current = 0;
      }

      rotationRef.current = (rotationRef.current + velocityRef.current * dt) % 360;

      if (vinylRef.current) {
        vinylRef.current.style.transform = `rotate(${rotationRef.current.toFixed(2)}deg)`;
      }

      if (active) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, speed]);

  // Audio Play/Pause handling
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = isMuted ? 0 : volume;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio autoplay prevented or error:", err);
          // Still toggle visuals so turntable turns on even if stream is blocked/offline
          setIsPlaying(true);
        });
    }
  }, [isPlaying, isMuted, volume]);

  // VU Meter needle dynamic movement during playback
  useEffect(() => {
    if (!isPlaying) {
      setVuAngle(-38);
      if (vuIntervalRef.current) clearInterval(vuIntervalRef.current);
      return;
    }

    vuIntervalRef.current = setInterval(() => {
      // Natural audio level fluctuations (-15deg to +18deg)
      const base = -10 + (volume * 18);
      const jitter = (Math.random() - 0.45) * 26;
      const clamped = Math.max(-36, Math.min(26, base + jitter));
      setVuAngle(clamped);
    }, 110);

    return () => {
      if (vuIntervalRef.current) clearInterval(vuIntervalRef.current);
    };
  }, [isPlaying, volume]);

  // Volume synchronization
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Volume knob angle: 0deg (0% vol) to 270deg (100% vol)
  const knobAngle = (isMuted ? 0 : volume) * 270;

  // Knob interaction: Mouse drag & wheel scrolling
  const handleKnobWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setVolume((prev) => Math.max(0, Math.min(1, Number((prev + delta).toFixed(2)))));
    if (isMuted) setIsMuted(false);
  };

  const handleKnobMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingKnob(true);
    const startY = e.clientY;
    const startVol = volume;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY; // upward = louder
      const newVol = Math.max(0, Math.min(1, startVol + deltaY / 150));
      setVolume(Number(newVol.toFixed(2)));
      if (isMuted) setIsMuted(false);
    };

    const handleMouseUp = () => {
      setIsDraggingKnob(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const uniqueId = useId();

  return (
    <div className={`relative flex w-full max-w-[480px] flex-col items-center select-none ${className}`}>
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={streamUrl}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          // If live stream fails to load, gracefully allow the visual vinyl to keep running
          console.log("Stream audio source fallback");
        }}
      />

      {/* =========================================================================
          01 // WOODEN PLINTH (Top-down view)
          Layered gradients + repeating wood-grain lines, light beveled edge, rounded-4px
          ========================================================================= */}
      <div
        className="relative w-full overflow-hidden rounded-[4px] border border-[#7a4825] p-3 sm:p-4 transition-all duration-300"
        style={{
          background: `
            linear-gradient(135deg, #422513 0%, #2b160a 45%, #3d2111 80%, #231106 100%),
            repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0,0,0,0.18) 4px, rgba(255,210,170,0.04) 5px, transparent 9px),
            repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.12) 3px, transparent 7px)
          `,
          boxShadow: `
            inset 1px 1px 0 rgba(255, 230, 200, 0.35),
            inset -1px -1px 2px rgba(0, 0, 0, 0.8),
            0 20px 45px -10px rgba(0, 0, 0, 0.85),
            0 8px 16px -4px rgba(0, 0, 0, 0.6)
          `,
        }}
      >
        {/* Subtle wood sheen reflection */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />

        {/* Four Corner Screws on Wooden Plinth */}
        <div className="pointer-events-none absolute left-2 top-2 size-2 rounded-full border border-black/60 bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600 shadow-sm flex items-center justify-center">
          <div className="h-[1px] w-1.5 bg-zinc-800 rotate-45" />
        </div>
        <div className="pointer-events-none absolute right-2 top-2 size-2 rounded-full border border-black/60 bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600 shadow-sm flex items-center justify-center">
          <div className="h-[1px] w-1.5 bg-zinc-800 -rotate-12" />
        </div>

        {/* =========================================================================
            TURNTABLE TOP STAGE (Recessed Platter + Vinyl Record + Tonearm)
            ========================================================================= */}
        <div className="relative aspect-square w-full rounded-[3px] bg-[#1a0f07]/90 p-2 sm:p-3 border border-black/60 shadow-inner flex items-center justify-center overflow-hidden">
          {/* Circular Platter Recess Bed */}
          <div
            className="relative flex aspect-square w-[92%] sm:w-[94%] items-center justify-center rounded-full"
            style={{
              background: "radial-gradient(circle, #1c1c1f 0%, #0d0d0f 85%, #2a2a30 100%)",
              boxShadow: "inset 0 6px 18px rgba(0,0,0,0.9), 0 0 0 2px #444",
            }}
          >
            {/* Platter Strobe Dots / Metal Rim */}
            <div className="pointer-events-none absolute inset-0 rounded-full border-[3px] border-dashed border-zinc-600/40" />

            {/* =========================================================================
                VINYL RECORD: Big black circle with fine concentric grooves,
                soft diagonal light reflection, thin silver rim
                ========================================================================= */}
            <div
              ref={vinylRef}
              onClick={togglePlay}
              className="group/vinyl relative flex aspect-square w-[86%] cursor-pointer items-center justify-center rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.95)] transition-transform active:scale-[0.99]"
              style={{
                boxShadow: "0 0 0 1.5px #a1a1aa, 0 12px 30px rgba(0,0,0,0.9)",
                background: `
                  repeating-radial-gradient(
                    circle at 50% 50%,
                    #0a0a0c 0px,
                    #0a0a0c 2px,
                    #18181b 2.8px,
                    #050507 3.5px,
                    #141416 4.5px
                  )
                `,
              }}
              title="Click to Play / Pause Turntable"
            >
              {/* Soft diagonal light reflection across vinyl (conic-gradient + angled sheen) */}
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background: `
                    conic-gradient(
                      from 35deg at 50% 50%,
                      transparent 0deg,
                      rgba(255, 255, 255, 0.16) 40deg,
                      transparent 80deg,
                      transparent 180deg,
                      rgba(255, 255, 255, 0.16) 220deg,
                      transparent 260deg,
                      transparent 360deg
                    ),
                    linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.06) 100%)
                  `,
                }}
              />

              {/* Concentric subtle groove markers */}
              <div className="pointer-events-none absolute inset-5 rounded-full border border-white/[0.04]" />
              <div className="pointer-events-none absolute inset-10 rounded-full border border-white/[0.04]" />
              <div className="pointer-events-none absolute inset-16 rounded-full border border-white/[0.04]" />

              {/* =========================================================================
                  CENTER LABEL: Yellow circle (30% diameter), thin darker ring,
                  "CBM RADIO" text, tiny silver spindle dot
                  ========================================================================= */}
              <div
                className="relative flex aspect-square w-[34%] items-center justify-center rounded-full border-2 border-zinc-900 overflow-hidden shadow-md"
                style={{
                  background: "radial-gradient(circle at 50% 50%, #fef08a 0%, #facc15 65%, #eab308 100%)",
                }}
              >
                {coverImage && (
                  <div className="absolute inset-0">
                    <Image
                      src={coverImage}
                      alt={nowPlayingTitle}
                      fill
                      className="object-cover"
                      unoptimized={typeof coverImage === "string"}
                    />
                    <div className="absolute inset-0 bg-black/35" />
                  </div>
                )}
                {/* Thin darker decorative inner rings */}
                <div className="pointer-events-none absolute inset-1.5 rounded-full border border-white/30" />
                <div className="pointer-events-none absolute inset-3 rounded-full border border-white/20" />

                {/* Curved / Centered Label Typography */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-1">
                  <span className="text-[7px] sm:text-[7.5px] font-black tracking-widest text-white drop-shadow uppercase leading-tight truncate max-w-[80px]">
                    {nowPlayingTitle}
                  </span>
                  <span className="mt-0.5 text-[5px] sm:text-[5.5px] font-mono font-bold tracking-wider text-[#04b093] leading-none drop-shadow">
                    33⅓ RPM
                  </span>
                </div>

                {/* Tiny Silver Spindle Dot in exact center */}
                <div className="relative z-20 size-2.5 sm:size-3 rounded-full border border-zinc-600 bg-gradient-to-br from-white via-zinc-300 to-zinc-500 shadow-sm" />
              </div>
            </div>
          </div>

          {/* =========================================================================
              TONEARM: Silver arm with round pivot base at top right, bent arm end,
              and small headshell (cartridge) at tip.
              Sits just on the record's edge when playing, rests outside when stopped.
              ========================================================================= */}
          <div
            className="pointer-events-none absolute right-3 top-3 h-[85%] w-[38%] z-20"
            style={{
              filter: "drop-shadow(6px 12px 10px rgba(0,0,0,0.85))",
            }}
          >
            {/* Pivot Base Assembly */}
            <div className="absolute right-2 top-2 size-11 sm:size-12 rounded-full border border-zinc-400 bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 shadow-md flex items-center justify-center">
              <div className="size-8 rounded-full border border-zinc-500 bg-gradient-to-tr from-zinc-700 via-zinc-400 to-zinc-200 shadow-inner flex items-center justify-center">
                {/* Center Pivot Axis Screw */}
                <div className="size-3.5 rounded-full border border-zinc-600 bg-zinc-300 shadow-sm flex items-center justify-center">
                  <div className="h-2 w-[1.5px] bg-zinc-700" />
                </div>
              </div>

              {/* Rear Counterweight extending slightly back */}
              <div className="absolute -top-2 right-1.5 h-3.5 w-6 rounded-sm border border-zinc-500 bg-gradient-to-b from-zinc-800 to-zinc-600 shadow" />
            </div>

            {/* Arm Rest Clip (outside the record) */}
            <div className="absolute right-4 top-16 size-3 rounded-full border border-zinc-600 bg-zinc-800 flex items-center justify-center">
              <div className="h-2 w-1 rounded-sm bg-zinc-400" />
            </div>

            {/* 
              Swinging Arm Assembly:
              Rotates smoothly around the pivot base at (right-7, top-7).
              Resting outside (stopped: 0deg).
              Playing on lead-in record edge (playing: +32deg).
            */}
            <div
              className="absolute right-7 top-7 h-[78%] w-12 transition-transform duration-1000 ease-in-out"
              style={{
                transformOrigin: "top center",
                transform: isPlaying ? "rotate(32deg)" : "rotate(0deg)",
              }}
            >
              {/* Silver metallic arm shaft (curved S / bent geometry) */}
              <div
                className="relative mx-auto h-full w-1.5 rounded-full"
                style={{
                  background: "linear-gradient(to right, #f4f4f5 0%, #d4d4d8 40%, #71717a 100%)",
                  boxShadow: "1px 0 3px rgba(0,0,0,0.5)",
                }}
              >
                {/* Bent lower arm connector */}
                <div
                  className="absolute bottom-4 -left-1.5 h-8 w-1.5 rotate-[-22deg] rounded-full"
                  style={{
                    background: "linear-gradient(to right, #f4f4f5 0%, #a1a1aa 100%)",
                  }}
                />

                {/* Cartridge / Headshell at the tip */}
                <div className="absolute -bottom-1 -left-3.5 h-6 w-3.5 rounded-sm border border-zinc-700 bg-zinc-950 shadow-md">
                  {/* Finger lift lever */}
                  <div className="absolute -right-1.5 top-1 h-3 w-1.5 rounded-tr border-t border-r border-zinc-400 bg-zinc-400" />
                  {/* Stylus needle marker tip */}
                  <div className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 bg-[#04b093] shadow-[0_0_4px_#04b093]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            02 // SILVER CONTROL PANEL ALONG THE BOTTOM
            Mini VU meter with moving red needle, three LEDs (power, live/playing, sync),
            big silver volume knob with ridged edge, 3 small round buttons, corner screws
            ========================================================================= */}
        <div
          className="relative mt-2.5 rounded-[3px] border border-zinc-400/80 px-3 py-2 sm:px-4 sm:py-2.5"
          style={{
            background: "linear-gradient(180deg, #f4f4f5 0%, #e4e4e7 40%, #d4d4d8 75%, #a1a1aa 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 1px rgba(0,0,0,0.3), 0 3px 8px rgba(0,0,0,0.5)",
          }}
        >
          {/* Panel Corner Screws */}
          <div className="pointer-events-none absolute left-1.5 top-1.5 size-1.5 rounded-full border border-zinc-500 bg-zinc-300 flex items-center justify-center">
            <div className="h-[1px] w-1 bg-zinc-700 rotate-45" />
          </div>
          <div className="pointer-events-none absolute right-1.5 top-1.5 size-1.5 rounded-full border border-zinc-500 bg-zinc-300 flex items-center justify-center">
            <div className="h-[1px] w-1 bg-zinc-700 -rotate-30" />
          </div>
          <div className="pointer-events-none absolute left-1.5 bottom-1.5 size-1.5 rounded-full border border-zinc-500 bg-zinc-300 flex items-center justify-center">
            <div className="h-[1px] w-1 bg-zinc-700 -rotate-60" />
          </div>
          <div className="pointer-events-none absolute right-1.5 bottom-1.5 size-1.5 rounded-full border border-zinc-500 bg-zinc-300 flex items-center justify-center">
            <div className="h-[1px] w-1 bg-zinc-700 rotate-15" />
          </div>

          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* LEFT: MINI ANALOG VU METER */}
            <div className="flex flex-col items-center">
              <div
                className="relative h-10 w-16 sm:h-11 sm:w-20 overflow-hidden rounded-sm border border-zinc-700 shadow-inner"
                style={{
                  background: "radial-gradient(ellipse at 50% 90%, #fef3c7 0%, #fde68a 60%, #d97706 100%)",
                }}
              >
                {/* VU Meter Dial scale markings */}
                <div className="absolute inset-x-1 top-1 flex justify-between text-[5px] sm:text-[6px] font-mono font-black text-zinc-800">
                  <span>-20</span>
                  <span>-7</span>
                  <span>0</span>
                  <span className="text-red-700 font-bold">+3</span>
                </div>

                {/* Curved arc marker */}
                <svg viewBox="0 0 80 40" className="absolute inset-0 h-full w-full pointer-events-none">
                  <path
                    d="M 12 28 Q 40 10 68 28"
                    fill="none"
                    stroke="#451a03"
                    strokeWidth="0.8"
                    strokeDasharray="1.5 1"
                  />
                  <path
                    d="M 52 18 Q 60 21 68 28"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="1.2"
                  />
                </svg>

                <div className="absolute bottom-0.5 inset-x-0 text-center text-[4.5px] font-mono font-black uppercase text-zinc-900 tracking-wider">
                  VU
                </div>

                {/* Moving Red Needle */}
                <div
                  className="absolute bottom-0 left-1/2 h-8 w-[1.5px] origin-bottom -translate-x-1/2 transition-transform duration-100 ease-out"
                  style={{
                    backgroundColor: "#dc2626",
                    boxShadow: "0 0 2px rgba(220, 38, 38, 0.8)",
                    transform: `translateX(-50%) rotate(${vuAngle}deg)`,
                  }}
                />
                {/* Needle Pivot Cap */}
                <div className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full border border-black bg-zinc-800 shadow" />
              </div>
              <span className="mt-0.5 text-[6px] sm:text-[7px] font-mono font-black tracking-widest text-zinc-700">
                LEVEL
              </span>
            </div>

            {/* CENTER-LEFT: 3 STATUS LEDS (Green Power, Red Playing/Live, Green Connected) */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                {/* LED 1: Power (Green) */}
                <div className="flex flex-col items-center gap-0.5">
                  <div
                    className="size-2 sm:size-2.5 rounded-full border border-black/40 bg-[#10b981] shadow-[0_0_6px_#10b981]"
                    title="Power: ON"
                  />
                  <span className="text-[5.5px] font-mono font-bold text-zinc-700">PWR</span>
                </div>

                {/* LED 2: Live / Playing (Red) */}
                <div className="flex flex-col items-center gap-0.5">
                  <div
                    className={`size-2 sm:size-2.5 rounded-full border border-black/40 transition-all duration-300 ${
                      isPlaying
                        ? "bg-[#ef4444] shadow-[0_0_10px_#ef4444] animate-pulse"
                        : "bg-[#450a0a] shadow-none opacity-50"
                    }`}
                    title={isPlaying ? "Status: BROADCAST LIVE" : "Status: IDLE"}
                  />
                  <span className={`text-[5.5px] font-mono font-black ${isPlaying ? "text-red-700" : "text-zinc-600"}`}>
                    LIVE
                  </span>
                </div>

                {/* LED 3: Connected / Stream Sync (Green) */}
                <div className="flex flex-col items-center gap-0.5">
                  <div
                    className="size-2 sm:size-2.5 rounded-full border border-black/40 bg-[#10b981] shadow-[0_0_5px_#10b981]"
                    title="Stream Sync: Connected"
                  />
                  <span className="text-[5.5px] font-mono font-bold text-zinc-700">SYNC</span>
                </div>
              </div>
            </div>

            {/* CENTER-RIGHT: 3 SMALL ROUND METALLIC BUTTONS */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Button 1: Play / Pause */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause Broadcast" : "Play Broadcast"}
                className={`group grid size-6 sm:size-7 place-items-center rounded-full border border-zinc-600 shadow transition-all active:scale-90 cursor-pointer ${
                  isPlaying
                    ? "bg-[#04b093] text-black border-black shadow-[0_0_8px_rgba(4,176,147,0.5)]"
                    : "bg-gradient-to-b from-zinc-100 to-zinc-400 text-zinc-800 hover:from-white hover:to-zinc-300"
                }`}
                title={isPlaying ? "Pause Turntable" : "Play Turntable"}
              >
                {isPlaying ? <Pause size={10} className="fill-black" /> : <Play size={10} className="fill-zinc-800 translate-x-[1px]" />}
              </button>

              {/* Button 2: 33 / 45 RPM Toggle */}
              <button
                type="button"
                onClick={() => setSpeed((prev) => (prev === 33 ? 45 : 33))}
                aria-label={`Toggle speed, currently ${speed} RPM`}
                className="grid size-6 sm:size-7 place-items-center rounded-full border border-zinc-600 bg-gradient-to-b from-zinc-100 to-zinc-400 text-[6.5px] sm:text-[7.5px] font-mono font-black text-zinc-800 shadow transition-all active:scale-90 hover:from-white hover:to-zinc-300 cursor-pointer"
                title={`Speed: ${speed} RPM (Click to toggle)`}
              >
                {speed}
              </button>

              {/* Button 3: Mute Toggle */}
              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                aria-label={isMuted ? "Unmute Volume" : "Mute Volume"}
                className={`grid size-6 sm:size-7 place-items-center rounded-full border border-zinc-600 shadow transition-all active:scale-90 cursor-pointer ${
                  isMuted
                    ? "bg-red-500 text-white border-red-700"
                    : "bg-gradient-to-b from-zinc-100 to-zinc-400 text-zinc-800 hover:from-white hover:to-zinc-300"
                }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={10} /> : <Volume2 size={10} />}
              </button>
            </div>

            {/* RIGHT: BIG SILVER VOLUME KNOB WITH RIDGED / KNURLED EDGE */}
            <div className="flex flex-col items-center">
              <div
                ref={knobRef}
                onWheel={handleKnobWheel}
                onMouseDown={handleKnobMouseDown}
                className="group relative size-9 sm:size-11 cursor-ns-resize rounded-full border-2 border-zinc-500 shadow-lg active:scale-95"
                style={{
                  background: `
                    repeating-conic-gradient(from 0deg, #d4d4d8 0deg 3deg, #71717a 3deg 6deg),
                    radial-gradient(circle at 50% 50%, #f4f4f5 20%, #a1a1aa 85%, #52525b 100%)
                  `,
                }}
                title={`Volume: ${Math.round(volume * 100)}% (Drag or scroll)`}
              >
                {/* Knob Cap Core */}
                <div className="absolute inset-1 rounded-full border border-zinc-400 bg-gradient-to-tr from-zinc-400 via-zinc-200 to-white shadow-inner flex items-center justify-center">
                  {/* Rotating Indicator Line (0 to 270 deg) */}
                  <div
                    className="absolute inset-0 flex justify-center transition-transform duration-75 pointer-events-none"
                    style={{
                      transform: `rotate(${knobAngle - 135}deg)`,
                    }}
                  >
                    <div className="h-2 w-[2px] rounded-full bg-zinc-950 mt-0.5" />
                  </div>
                </div>
              </div>
              <span className="mt-0.5 text-[6px] sm:text-[7px] font-mono font-black text-zinc-700">
                VOL {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          03 // "NOW PLAYING" DISPLAY BELOW THE TURNTABLE
          ========================================================================= */}
      <div className="mt-3 w-full rounded-xl border border-white/15 bg-zinc-950/90 p-3 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-between text-[0.62rem] font-mono font-black uppercase tracking-wider text-zinc-400 border-b border-white/10 pb-1.5">
          <div className="flex items-center gap-1.5">
            <Radio size={12} className={isPlaying ? "text-[#04b093] animate-pulse" : "text-zinc-500"} />
            <span className={isPlaying ? "text-[#04b093]" : "text-zinc-400"}>
              {isPlaying ? "ON AIR // NOW PLAYING" : "STANDBY // TAP RECORD TO SPIN"}
            </span>
          </div>
          <span className="text-[#04b093] font-bold">
            {speed}⅓ RPM HI-FI
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-black uppercase text-white tracking-tight truncate">
              {nowPlayingTitle}
            </h4>
            <p className="mt-0.5 text-[0.72rem] font-medium text-zinc-400 truncate">
              {nowPlayingSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={togglePlay}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#04b093] bg-[#04b093] px-3.5 py-1.5 text-[0.68rem] font-black uppercase tracking-wider text-black transition hover:bg-white hover:border-white active:scale-95 cursor-pointer shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause size={11} className="fill-black" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={11} className="fill-black" />
                <span>Play Live</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
