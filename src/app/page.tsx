'use client'; // Add this at the very top if not already a client component, or move RotatedFrameWithTilt to its own client component file

import { useRef, useEffect, useState } from 'react';
import type { ReactNode, MouseEvent as ReactMouseEvent, RefObject } from 'react'; // Import ReactNode and ReactMouseEvent for typing

// Define the new Client Component for the interactive frame
const RotatedFrameWithTilt = ({ 
  children, 
  interactionContainerRef 
}: { 
  children: ReactNode; 
  interactionContainerRef: RefObject<HTMLDivElement>;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouseHover, setMouseHover] = useState(false);

  const SCALE_X = 4;
  const SCALE_Y = 8;
  const INITIAL_Z_ROTATION = '1deg'; // New constant for initial rotation

  // Store the initial transform from Tailwind classes
  const [initialTransform, setInitialTransform] = useState('');

  useEffect(() => {
    const card = cardRef.current;
    const container = interactionContainerRef.current;
    if (!card || !container) return;

    // Capture the initial transform set by Tailwind classes
    // This ensures our JS transform combines with the static Tailwind transforms (like rotate-[3deg])
    // Note: This might be tricky if Tailwind applies transforms late or via multiple classes.
    // A more robust way might be to read computed style once, but this is simpler for now.
    // We only want to capture it once.
    if (!initialTransform) {
      // The issue here is that Tailwind classes like rotate-[3deg] are applied, 
      // but JS overwrites the entire transform style. We need to preserve the static part.
      // This is complex. A simpler model for now: JS will *override* static Tailwind rotation during hover.
      // The static `rotate-[3deg]` from Tailwind will apply when not hovered if JS resets to a simple perspective.
      // For true combination, we'd parse computed transform matrix, which is too complex here.
      // So, the `rotate-[3deg]` will be part of the non-hovered state set by `handleMouseOut`.
    }

    const handleMouseMove = (e: MouseEvent) => { // Changed to global MouseEvent as it's on container
      if (!mouseHover) return; // Check mouseHover state
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const containerWidth = container.offsetWidth || 0;
      const containerHeight = container.offsetHeight || 0;

      const rotateXVal = (y / containerHeight) * -(SCALE_Y * 2) + SCALE_Y;
      const rotateYVal = (x / containerWidth) * (SCALE_X * 2) - SCALE_X;
      
      // The JS transform now includes the static base rotation and translation for centering.
      // The md:-translate-x-1/5 is a CSS class and will apply independently to the absolute positioning.
      // The JS handles the interactive tilt.
      card.style.transform = `translate(-50%, -50%) rotate3d(0,0,1,${INITIAL_Z_ROTATION}) perspective(1000px) rotateX(${rotateXVal}deg) rotateY(${rotateYVal}deg) translateZ(10px)`;
    };

    const handleMouseOver = () => {
      setMouseHover(true);
      // Initial pop/effect can be done here if desired, but mouseMove will take over.
    };

    const handleMouseOut = () => {
      setMouseHover(false);
      if (card) {
        // Reset to include the static 3deg rotation and centering transforms.
        // The md:-translate-x-1/5 is a class and will persist.
        card.style.transform = `translate(-50%, -50%) rotate3d(0,0,1,${INITIAL_Z_ROTATION}) perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
      }
    };

    // Attach listeners to the container
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseOver);
    container.addEventListener('mouseleave', handleMouseOut);

    // Initial state if not hovered (applies to card, based on container's hover state)
    if (!mouseHover) {
       card.style.transform = `translate(-50%, -50%) rotate3d(0,0,1,${INITIAL_Z_ROTATION}) perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    }

    return () => {
      // Remove listeners from the container
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseOver);
      container.removeEventListener('mouseleave', handleMouseOut);
      // Reset card style on unmount or effect re-run, if card exists
      if (card) {
         card.style.transform = `translate(-50%, -50%) rotate3d(0,0,1,${INITIAL_Z_ROTATION}) perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseHover, interactionContainerRef]); // Added interactionContainerRef to deps

  return (
    <div
      ref={cardRef} // This ref is still for the card itself
      className="bg-gradient-to-br from-purple-300 via-pink-300 to-rose-300 aspect-[10/9] w-[40vw] shadow-xl p-1 md:p-2 flex flex-col absolute top-1/2 left-1/2 z-10 md:-translate-x-1/5 transition-transform duration-700 ease-out"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

export default async function Index() {
  const interactionContainerRef = useRef<HTMLDivElement>(null); // Create ref for interaction area

  return (
    <div className="absolute inset-0 font-serif flex flex-col">


      {/* Transparent spacer component */}
      <div className="h-[96px] flex-shrink-0"></div>

      {/* Main content area with two columns - flex-grow within the absolute parent */}
      <div className="grid md:grid-cols-5 flex-grow min-h-0">
        {/* Left Column - spans 3 columns, with only a right border */}
        <div className="md:col-span-3 flex flex-col min-h-0 border-r-2 border-[#6e7b99]">
          {/* Inner container for scrollable content - now flex-grow */}
          <div className="flex-grow overflow-y-auto">
            {/* Item 1: Ted Lavender */}
            <div className="flex items-baseline border-b-2 border-[#6e7b99] p-6 md:p-8">
              <span className="text-xs text-[#6e7b99] mr-4 pt-1">2023</span>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#6e7b99]">Ted Lavender</h2>
            </div>

            {/* Item 2: Curt Lemon */}
            <div className="flex items-baseline border-b-2 border-[#6e7b99] p-6 md:p-8">
              <span className="text-xs text-[#6e7b99] mr-4 pt-1">2022</span>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#6e7b99]">Curt Lemon</h2>
            </div>

            {/* Item 3: Lee Strunk */}
            <div className="flex items-baseline border-b-2 border-[#6e7b99] p-6 md:p-8">
              <span className="text-xs text-[#6e7b99] mr-4 pt-1">2021</span>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#6e7b99]">Lee Strunk</h2>
            </div>

            {/* Item 4: Kiowa */}
            <div className="flex items-baseline border-b-2 border-[#6e7b99] p-6 md:p-8">
              <span className="text-xs text-[#6e7b99] mr-4 pt-1">2020</span>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#6e7b99]">Kiowa</h2>
            </div>

            {/* Item 5: Norman Bowker */}
            <div className="flex items-baseline border-b-2 border-[#6e7b99] p-6 md:p-8">
              <span className="text-xs text-[#6e7b99] mr-4 pt-1">2019</span>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#6e7b99]">Norman Bowker</h2>
            </div>
            {/* Add more items here to test scrolling if needed */}
          </div>
        </div>

        {/* Right Column - spans 2 columns, overflow-hidden REMOVED to allow child to overflow */}
        <div 
          ref={interactionContainerRef} // Moved ref to this parent div
          className="md:col-span-2 relative p-6 md:p-8 flex flex-col justify-between"
        >
          {/* Rotated Frame Area for Text - ref REMOVED from here */}
          <div 
            className="flex-grow flex items-center justify-center" 
            style={{ perspective: '1000px', transformStyle: 'preserve-3d'}}
          >
            <RotatedFrameWithTilt interactionContainerRef={interactionContainerRef}> 
              <div className="w-full h-full flex-grow overflow-y-auto p-3 md:p-4 text-white text-sm leading-relaxed">
                <p className="mt-2">
                  "Quote 1"
                </p>
                <p className="mt-2">
                  "Quote 2"
                </p>
                <p className="mt-2">
                  "Quote 3"
                </p>
              </div>
            </RotatedFrameWithTilt>
          </div>

          {/* Text at the bottom right of the right column */}
          <div className="text-right text-xs text-[#6e7b99] space-y-1 mt-auto">
            <p>The Things</p>
            <p>They Carried</p>
          </div>
        </div>
      </div>
    </div>
  )
}
