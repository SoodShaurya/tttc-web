'use client'; // Add this at the very top if not already a client component, or move RotatedFrameWithTilt to its own client component file

import { useRef, useEffect, useState } from 'react';
import type { ReactNode, RefObject } from 'react'; // Removed ReactMouseEvent as it's not directly used in types here

// Define the new Client Component for the interactive frame
const RotatedFrameWithTilt = ({ 
  children, 
  interactionContainerRef,
  isVisible // New prop for controlling content visibility
}: { 
  children: ReactNode; 
  interactionContainerRef: RefObject<HTMLDivElement>;
  isVisible: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  // mouseHover state for the tilt effect itself is still local to this component
  const [mouseHoverTilt, setMouseHoverTilt] = useState(false); 

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
      // So, the `rotate-[3deg]` will be part of the non-hovered state set by `handleMouseOutTilt`.
    }

    const handleMouseMove = (e: MouseEvent) => { 
      if (!mouseHoverTilt || !card) return; // Use local mouseHoverTilt for tilt effect
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

    const handleMouseOverTilt = () => { // Renamed to avoid confusion
      setMouseHoverTilt(true);
    };

    const handleMouseOutTilt = () => { // Renamed to avoid confusion
      setMouseHoverTilt(false);
      if (card) {
        // Reset to include the static 3deg rotation and centering transforms.
        // The md:-translate-x-1/5 is a class and will persist.
        card.style.transform = `translate(-50%, -50%) rotate3d(0,0,1,${INITIAL_Z_ROTATION}) perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
      }
    };

    // Listeners for the tilt effect on the interaction container
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseOverTilt);
    container.addEventListener('mouseleave', handleMouseOutTilt);

    // Initial state for tilt if not hovered
    if (!mouseHoverTilt && card) {
       card.style.transform = `translate(-50%, -50%) rotate3d(0,0,1,${INITIAL_Z_ROTATION}) perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    }

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseOverTilt);
      container.removeEventListener('mouseleave', handleMouseOutTilt);
      // Reset card style on unmount or effect re-run, if card exists
      if (card) {
         card.style.transform = `translate(-50%, -50%) rotate3d(0,0,1,${INITIAL_Z_ROTATION}) perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseHoverTilt, interactionContainerRef]); // Dependency is on local mouseHoverTilt

  return (
    <div
      ref={cardRef} // This ref is for the card itself for transforms
      className="bg-gradient-to-br from-[#8296b5] to-[#a0b8db] aspect-[10/9] w-[40vw] shadow-2xl opacity-90 p-1 md:p-2 flex flex-col absolute top-1/2 left-1/2 z-10 md:-translate-x-1/5 transition-transform duration-700 ease-out"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* This inner div now handles the fade transition for the content */}
      <div className={`w-full h-full flex-grow overflow-y-auto p-3 md:p-4 text-white text-sm leading-relaxed transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

const defaultCardContent = (
  <>
    <p className="mt-2">"Quote 1 - Default"</p>
    <p className="mt-2">"Quote 2 - Default"</p>
    <p className="mt-2">"Quote 3 - Default"</p>
  </>
);

const leftColumnItems = [
  { year: "2023", name: "Ted Lavender", key: "ted-lavender", cardDetails: "Ted Lavender: Carried tranquilizers until he was shot in the head.", expandedText: "Expanded text for Ted Lavender: He was scared. He carried more than 20 pounds of ammunition, plus supplies."}, 
  { year: "2022", name: "Curt Lemon", key: "curt-lemon", cardDetails: "Curt Lemon: Known for his bravery and childishness; died playing catch with a grenade.", expandedText: "Expanded text for Curt Lemon: He was a daredevil. He painted his body and went trick-or-treating in Vietnamese villages."}, 
  { year: "2021", name: "Lee Strunk", key: "lee-strunk", cardDetails: "Lee Strunk: Fought with Dave Jensen over a stolen jackknife; later died from a leg wound.", expandedText: "Expanded text for Lee Strunk: Made a pact with Jensen that if one got seriously wounded, the other would kill him."}, 
  { year: "2020", name: "Kiowa", key: "kiowa", cardDetails: "Kiowa: A devout Baptist and a compassionate soldier; died in a sewage field.", expandedText: "Expanded text for Kiowa: Carried an illustrated New Testament. His death deeply affected everyone."}, 
  { year: "2019", name: "Norman Bowker", key: "norman-bowker", cardDetails: "Norman Bowker: Struggled with guilt and the inability to talk about his war experiences; hanged himself. Struggled with guilt and the inability to talk about his war experiences; hanged himself. Struggled with guilt and the inability to talk about his war experiences; hanged himself. Struggled with guilt and the inability to talk about his war experiences; hanged himself. Struggled with guilt and the inability to talk about his war experiences; hanged himself. Struggled with guilt and the inability to talk about his war experiences; hanged himself. Struggled with guilt and the inability to talk about his war experiences; hanged himself.", expandedText: "Expanded text for Norman Bowker: Felt responsible for Kiowa's death. Couldn't find a way to live with his memories. Struggled with guilt and the inability to talk about his war experiences; hanged himself. Struggled with guilt and the inability to talk about his war experiences; hanged himself. Struggled with guilt and the inability to talk about his war experiences; hanged himself. Struggled with guilt and the inability to talk about his war experiences; hanged himself. Struggled with guilt and the inability to talk about his war experiences; hanged himself. Struggled with guilt and the inability to talk about his war experiences; hanged himself. Struggled with guilt and the inability to talk about his war experiences; hanged himself. Struggled with guilt and the inability to talk about his war experiences; hanged himself."},
];

export default function Index() {
  const interactionContainerRef = useRef<HTMLDivElement>(null);
  const [expandedItemKey, setExpandedItemKey] = useState<string | null>(null);
  
  const [currentCardContent, setCurrentCardContent] = useState<ReactNode>(defaultCardContent);
  const [isCardContentVisible, setIsCardContentVisible] = useState(true);
  const [hoveredItemKeyForCard, setHoveredItemKeyForCard] = useState<string | null>(null);

  const handleToggleItem = (key: string) => {
    setExpandedItemKey(prevKey => (prevKey === key ? null : key));
  };

  const handleItemMouseEnter = (itemKey: string, cardDetails: ReactNode) => {
    if (itemKey === hoveredItemKeyForCard) {
      return; // Already showing this item's content, do nothing
    }

    setIsCardContentVisible(false);
    setTimeout(() => {
      setCurrentCardContent(cardDetails);
      setHoveredItemKeyForCard(itemKey);
      setIsCardContentVisible(true);
    }, 300); // This duration should match the CSS transition duration (300ms)
  };

  return (
    <div className="absolute inset-0 font-serif flex flex-col">
      <div className="h-[96px] flex-shrink-0"></div>
      <div className="grid md:grid-cols-5 flex-grow min-h-0">
        <div className="md:col-span-3 flex flex-col min-h-0 border-r-2 border-[#6e7b99]">
          <div className="flex-grow overflow-y-auto">
            {leftColumnItems.map((item) => (
              <div key={item.key} className="border-b-2 border-[#6e7b99]">
                <div 
                  className="flex items-baseline p-8 md:p-12 cursor-pointer hover:bg-gray-100/10 transition-colors duration-200"
                  onClick={() => handleToggleItem(item.key)}
                  onMouseEnter={() => handleItemMouseEnter(item.key, item.cardDetails)} 
                  // No onMouseLeave for card content change anymore
                >
                  <span className="text-xs text-[#6e7b99] mr-4 pt-1">{item.year}</span>
                  <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#6e7b99]">{item.name}</h2>
                </div>
                <div 
                  className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    ${expandedItemKey === item.key ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className="p-6 md:p-8 bg-gray-500/10">
                    <p className="text-[#6e7b99]">
                      {item.expandedText}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div 
          ref={interactionContainerRef} // Ref for tilt interaction area
          className="md:col-span-2 relative p-6 md:p-8 flex flex-col justify-between"
        >
          <div 
            className="flex-grow flex items-center justify-center" 
            style={{ perspective: '1000px', transformStyle: 'preserve-3d'}}
          >
            <RotatedFrameWithTilt 
              interactionContainerRef={interactionContainerRef} 
              isVisible={isCardContentVisible} // Pass visibility state for content fade
            >
              {currentCardContent} {/* Dynamic content for the card */}
            </RotatedFrameWithTilt>
          </div>
          <div className="text-right text-xs text-[#6e7b99] space-y-1 mt-auto">
            <p>The Things</p>
            <p>They Carried</p>
          </div>
        </div>
      </div>
    </div>
  );
}
