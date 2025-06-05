'use client' // Add this at the very top if not already a client component, or move RotatedFrameWithTilt to its own client component file

import { useRef, useEffect, useState } from 'react'
import type { ReactNode, RefObject } from 'react'

// Audio management utilities
let currentAudio: HTMLAudioElement | null = null

const stopCurrentAudio = () => {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
}

const playAudio = (audioFile: string, isAudioEnabled: boolean) => {
  if (!isAudioEnabled) return // Don't play if audio is disabled
  stopCurrentAudio()
  const audio = new Audio(audioFile)
  currentAudio = audio
  audio.play().catch((error) => console.error('Error playing audio:', error))
}

const getRandomAudioFile = (character: string): string | null => {
  try {
    // Remove any prefix from the key (e.g., "ted-lavender" -> "lavender")
    const name = character.split('-').pop() || character
    // Dynamically import one random audio file for the character
    const audioFiles = {
      lavender: [1, 2, 3, 4, 5, 6],
      lemon: [1, 2, 3],
      strunk: [1, 2, 3, 4],
      kiowa: [1, 2, 3, 4],
      bowker: [1, 2, 3, 4],
    }

    const files = audioFiles[name as keyof typeof audioFiles]
    if (!files) return null

    const randomIndex = Math.floor(Math.random() * files.length)
    return `/voices/${name}/${files[randomIndex]}.wav`
  } catch (error) {
    console.error('Error getting audio file:', error)
    return null
  }
}

// Define the new Client Component for the interactive frame
const RotatedFrameWithTilt = ({
  children,
  interactionContainerRef,
  isVisible, // New prop for controlling content visibility
}: {
  children: ReactNode
  interactionContainerRef: RefObject<HTMLDivElement>
  isVisible: boolean
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  // mouseHover state for the tilt effect itself is still local to this component
  const [mouseHoverTilt, setMouseHoverTilt] = useState(false)

  const SCALE_X = 4
  const SCALE_Y = 8
  const INITIAL_Z_ROTATION = '1deg' // New constant for initial rotation

  // Store the initial transform from Tailwind classes
  const [initialTransform, setInitialTransform] = useState('')

  useEffect(() => {
    const card = cardRef.current
    const container = interactionContainerRef.current
    if (!card || !container) return

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
      if (!mouseHoverTilt || !card) return // Use local mouseHoverTilt for tilt effect
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const containerWidth = container.offsetWidth || 0
      const containerHeight = container.offsetHeight || 0

      const rotateXVal = (y / containerHeight) * -(SCALE_Y * 2) + SCALE_Y
      const rotateYVal = (x / containerWidth) * (SCALE_X * 2) - SCALE_X

      // The JS transform now includes the static base rotation and translation for centering.
      // The md:-translate-x-1/5 is a CSS class and will apply independently to the absolute positioning.
      // The JS handles the interactive tilt.
      card.style.transform = `translate(-50%, -50%) rotate3d(0,0,1,${INITIAL_Z_ROTATION}) perspective(1000px) rotateX(${rotateXVal}deg) rotateY(${rotateYVal}deg) translateZ(10px)`
    }

    const handleMouseOverTilt = () => {
      // Renamed to avoid confusion
      setMouseHoverTilt(true)
    }

    const handleMouseOutTilt = () => {
      // Renamed to avoid confusion
      setMouseHoverTilt(false)
      if (card) {
        // Reset to include the static 3deg rotation and centering transforms.
        // The md:-translate-x-1/5 is a class and will persist.
        card.style.transform = `translate(-50%, -50%) rotate3d(0,0,1,${INITIAL_Z_ROTATION}) perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)`
      }
    }

    // Listeners for the tilt effect on the interaction container
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseenter', handleMouseOverTilt)
    container.addEventListener('mouseleave', handleMouseOutTilt)

    // Initial state for tilt if not hovered
    if (!mouseHoverTilt && card) {
      card.style.transform = `translate(-50%, -50%) rotate3d(0,0,1,${INITIAL_Z_ROTATION}) perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)`
    }

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseenter', handleMouseOverTilt)
      container.removeEventListener('mouseleave', handleMouseOutTilt)
      // Reset card style on unmount or effect re-run, if card exists
      if (card) {
        card.style.transform = `translate(-50%, -50%) rotate3d(0,0,1,${INITIAL_Z_ROTATION}) perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)`
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseHoverTilt, interactionContainerRef]) // Dependency is on local mouseHoverTilt

  return (
    <div
      ref={cardRef} // This ref is for the card itself for transforms
      className="md:-translate-x-1/5 absolute left-1/2 top-1/2 z-10 flex aspect-[10/9] w-[40vw] flex-col bg-gradient-to-br from-[#8296b5] to-[#a0b8db] p-1 opacity-90 shadow-2xl transition-transform duration-700 ease-out md:p-2"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* This inner div now handles the fade transition for the content */}
      <div
        className={`h-full w-full flex-grow overflow-y-auto whitespace-pre-wrap break-words p-3 text-lg leading-relaxed text-white transition-opacity duration-300 ease-in-out md:p-4 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {children}
      </div>
    </div>
  )
}

const defaultCardContent = (
  <>
    <p className="mt-2">The Things They Carried</p>
  </>
)

const leftColumnItems = [
  {
    year: 'The Things They Carried',
    name: 'Ted Lavender',
    key: 'ted-lavender',
    cardDetails:
      '"But Ted Lavender, who was scared, carried 34 rounds when he was shot and killed outside Than Khe, and he went down under an exceptional burden, more than 20 pounds of ammunition, plus the flak jacket and helmet and rations and water and toilet paper and tranquilizers and all the rest, plus the unweighed fear" (O\'Brien 4).',
    expandedText:
      "Ted Lavender was an exceptional solider, and like any good solider he was scared. He carried too much: 34 rounds of ammunition, a flak jacket, a helmet, rations, water, toilet paper, tranquilizers, and more. But it wasn't the weight of gear that brought him down. It was the quiet, invisible load. While others masked the dread of war with jokes or denial, Lavender masked his with tranquilizers and dope. He died outside Than Khe under an exceptional weight, both seen and unseen.",
  },
  {
    year: 'How to Tell a True War Story',
    name: 'Curt Lemon',
    key: 'curt-lemon',
    cardDetails:
      '"Curt Lemon steps from the shade into bright sunlight, his face brown and shining, and then he soars into a tree. The bad stuff never stops happening: it lives in its own dimension, replaying itself over and over. But the war wasn\'t all that way" (O\'Brien 21).\n\n"He was playing catch with Rat Kiley, laughing, and then he was dead. The sunlight came around him and lifted him up and sucked him high into a tree full of moss and vines and white blossoms" (O\'Brien 49).',
    expandedText:
      'Curt Lemon lived in the moment. He laughed in the face of danger, but behind that mask of bravado, he was terrified. The war was constantly testing him, but he had to show he was brave. His death was sudden, unexpected, and left a mark on those who witnessed it. He was playing catch with Rat Kiley, laughing, and then he was dead. The sunlight came around him and lifted him up and sucked him high into a tree full of moss and vines and white blossoms.',
  },
  {
    year: 'Friends',
    name: 'Lee Strunk',
    key: 'lee-strunk',
    cardDetails:
      '"Lee Strunk carried his slingshot; ammo, he claimed, would never be a problem" (O\'Brien 6). \n\n"Dave Jensen and Lee Strunk did not become instant buddies, but they did learn to trust each other. Over the next month they often teamed up on ambushes. They covered each other on patrol, shared a foxhole, took turns pulling guard at night. In late August they made a pact that if one of them should ever get totally rucked up—a wheelchair wound—the other guy would automatically find a way to end it" (O\'Brien 40)',
    expandedText:
      'Strunk was a brave young soldier who, just as the others did, carried himself with bravado. After a dispute with Jensen over a jackknife, they quickly became friends. They made a pact to kill the other if they got injured in war. The war was brutal, and death would be better than the shame and difficulties that they would face if they were to return injured. However, when it came to it, Strunk wanted to live, as anyone would. He died on his way home.',
  },
  {
    year: 'In the Field',
    name: 'Kiowa',
    key: 'kiowa',
    cardDetails:
      '"Kiowa, a devout Baptist, carried an illustrated New Testament that had been presented to him by his father, who taught Sunday school in Oklahoma City, Oklahoma" (O\'Brien 2). \n\n"As a hedge against bad times, however, Kiowa also carried his grandmother\'s distrust of the white man, his grandfather\'s old hunting hatchet" (O\'Brien 2). \n\n"On ambush, or other night missions, they carried peculiar little odds and ends. Kiowa always took along his New Testament and a pair of moccasins for silence" (O\'Brien 6).',
    expandedText:
      "Kiowa was a man of faith, carrying his illustrated New Testament and a pair of moccasins for silence. He was a devout Baptist, but he also carried the weight of his family's history and distrust of the white. His death was sudden and tragic, drowning in the sewage of the Song Tra Bong River. The weight of his death was felt by all, especially Norman Bowker, who drove around a lake for years, haunted by the memory of Kiowa's death and his own inability to save him.",
  },
  {
    year: 'Notes',
    name: 'Norman Bowker',
    key: 'norman-bowker',
    cardDetails:
      '"Norman Bowker carried a diary" (O\'Brien 2). \n\n"Norman Bowker, otherwise a very gentle person, carried a thumb that had been presented to him as a gift by Mitchell Sanders. The thumb was dark brown, rubbery to the touch, and weighed 4 ounces at most. It had been cut from a VC corpse, a boy of fifteen or sixteen" (O\'Brien 9).',
    expandedText:
      "Norman Bowker survived the war, but he was haunted by all the death and destruction he had witnessed. He carried a diary to try to make sense of it all, but it was never enough. The thumb he carried was a reminder of the violence and brutality of war, a symbol of the things he had done and seen. He drove around a lake for years, haunted by the memory of Kiowa's death and his own inability to save him. The weight of his experiences was too much to bear, and he eventually took his own life.",
  },
]

export default function Index() {
  const interactionContainerRef = useRef<HTMLDivElement>(null)
  const [expandedItemKey, setExpandedItemKey] = useState<string | null>(null)

  const [currentCardContent, setCurrentCardContent] =
    useState<ReactNode>(defaultCardContent)
  const [isCardContentVisible, setIsCardContentVisible] = useState(true)
  const [hoveredItemKeyForCard, setHoveredItemKeyForCard] = useState<
    string | null
  >(null)

  // State for audio consent flow
  const [consentStep, setConsentStep] = useState<
    'showing' | 'fadingOut' | 'done'
  >('showing')
  const [mainContentVisible, setMainContentVisible] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false) // Track audio enabled state

  const handleToggleItem = (key: string) => {
    setExpandedItemKey((prevKey) => (prevKey === key ? null : key))
  }

  const handleItemMouseEnter = (itemKey: string, cardDetails: ReactNode) => {
    if (itemKey === hoveredItemKeyForCard) {
      return // Already showing this item's content, do nothing
    }

    // Play audio if it exists and audio is enabled
    const audioFile = getRandomAudioFile(itemKey)
    if (audioFile) {
      playAudio(audioFile, audioEnabled)
    }

    setIsCardContentVisible(false)
    setTimeout(() => {
      setCurrentCardContent(cardDetails)
      setHoveredItemKeyForCard(itemKey)
      setIsCardContentVisible(true)
    }, 300) // This duration should match the CSS transition duration (300ms)
  }

  const handleAudioChoice = (choice: boolean) => {
    setAudioEnabled(choice) // Store the audio preference
    setConsentStep('fadingOut')
    setTimeout(() => {
      setConsentStep('done')
      setMainContentVisible(true)
    }, 300) // Duration for consent screen to fade out
  }

  // Effect to handle audio playback on character hover
  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const itemKey = target
        .closest('[data-item-key]')
        ?.getAttribute('data-item-key')
      if (itemKey) {
        const audioFile = getRandomAudioFile(itemKey)
        if (audioFile) {
          playAudio(audioFile, audioEnabled)
        }
      }
    }

    const container = interactionContainerRef.current
    container?.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      container?.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [interactionContainerRef, audioEnabled])

  if (consentStep !== 'done') {
    return (
      <div
        className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-gray-900 transition-opacity duration-300 ease-in-out ${consentStep === 'showing' ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="text-center">
          <h2 className="mb-12 font-serif text-4xl font-extralight tracking-tight text-[#FFFFFF]">
            Would you like to enable audio?
          </h2>
          <div className="flex justify-center space-x-12">
            {/* Speaker On Icon Button */}
            <button
              onClick={() => handleAudioChoice(true)}
              className="rounded-full p-2 text-[#FFFFFF] transition-colors duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
              aria-label="Enable Audio"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-16 w-16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                />
              </svg>
            </button>
            {/* Speaker Off Icon Button - Using user-provided speaker-x-mark SVG */}
            <button
              onClick={() => handleAudioChoice(false)}
              className="rounded-full p-2 text-[#FFFFFF] transition-colors duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
              aria-label="Disable Audio"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-16 w-16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`absolute inset-0 flex flex-col font-serif transition-opacity duration-500 ease-in-out ${mainContentVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Header Spacer */}
      <div className="h-[96px] flex-shrink-0"></div>

      {/* Main Grid Layout */}
      <div className="grid min-h-0 flex-grow md:grid-cols-5">
        {/* Left Column */}
        <div className="flex min-h-0 flex-col border-r-2 border-[#FFFFFF] md:col-span-3">
          <div className="flex-grow overflow-y-auto">
            {leftColumnItems.map((item) => (
              <div key={item.key} className="border-b-2 border-[#FFFFFF]">
                <div
                  className="flex cursor-pointer items-baseline p-8 transition-colors duration-200 hover:bg-gray-100/10 md:p-12"
                  onClick={() => handleToggleItem(item.key)}
                  onMouseEnter={() =>
                    handleItemMouseEnter(item.key, item.cardDetails)
                  }
                  // No onMouseLeave for card content change anymore
                >
                  <h2 className="text-4xl font-extralight tracking-tight text-[#FFFFFF] md:text-5xl">
                    {item.name}
                  </h2>
                  <span className="ml-auto flex flex-1 justify-end pt-1 text-right text-xs text-[#FFFFFF]">
                    {item.year}
                  </span>
                </div>
                <div
                  className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    ${expandedItemKey === item.key ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className="bg-gray-500/10 p-6 md:p-8">
                    <p className="text-[#FFFFFF]">{item.expandedText}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div
          ref={interactionContainerRef} // Ref for tilt interaction area
          className="relative flex flex-col justify-between p-6 md:col-span-2 md:p-8"
        >
          <div
            className="flex flex-grow items-center justify-center"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            <RotatedFrameWithTilt
              interactionContainerRef={interactionContainerRef}
              isVisible={isCardContentVisible} // Pass visibility state for content fade
            >
              {currentCardContent} {/* Dynamic content for the card */}
            </RotatedFrameWithTilt>
          </div>
          <div className="mt-auto space-y-1 text-right text-xs text-[#FFFFFF]">
            <p>The Things</p>
            <p>They Carried</p>
          </div>
        </div>
      </div>
    </div>
  )
}
