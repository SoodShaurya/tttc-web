export default async function Index() {
  return (
    <div className="absolute inset-0 font-serif flex flex-col">


      {/* Transparent spacer component */}
      <div className="h-[96px] flex-shrink-0"></div>

      {/* Main content area with two columns - flex-grow within the absolute parent */}
      <div className="grid md:grid-cols-5 flex-grow min-h-0">
        {/* Left Column - spans 3 columns, NOT scrollable itself, now min-h-0 */}
        <div className="md:col-span-3 flex flex-col min-h-0">
          {/* Inner container for scrollable content - now flex-grow */}
          <div className="flex-grow overflow-y-auto">
            {/* Item 1: Ted Lavender */}
            <div className="flex items-baseline border-b border-[#6e7b99] p-6 md:p-8">
              <span className="text-xs text-[#6e7b99] mr-4 pt-1">2023</span>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#6e7b99]">Ted Lavender</h2>
            </div>

            {/* Item 2: Curt Lemon */}
            <div className="flex items-baseline border-b border-[#6e7b99] p-6 md:p-8">
              <span className="text-xs text-[#6e7b99] mr-4 pt-1">2022</span>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#6e7b99]">Curt Lemon</h2>
            </div>

            {/* Item 3: Lee Strunk */}
            <div className="flex items-baseline border-b border-[#6e7b99] p-6 md:p-8">
              <span className="text-xs text-[#6e7b99] mr-4 pt-1">2021</span>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#6e7b99]">Lee Strunk</h2>
            </div>

            {/* Item 4: Kiowa */}
            <div className="flex items-baseline border-b border-[#6e7b99] p-6 md:p-8">
              <span className="text-xs text-[#6e7b99] mr-4 pt-1">2020</span>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#6e7b99]">Kiowa</h2>
            </div>

            {/* Item 5: Norman Bowker */}
            <div className="flex items-baseline border-b border-[#6e7b99] p-6 md:p-8">
              <span className="text-xs text-[#6e7b99] mr-4 pt-1">2019</span>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-[#6e7b99]">Norman Bowker</h2>
            </div>
            {/* Add more items here to test scrolling if needed */}
          </div>
        </div>

        {/* Right Column - spans 2 columns, overflow-hidden */}
        <div className="md:col-span-2 relative p-6 md:p-8 flex flex-col justify-between border-l border-[#6e7b99] overflow-hidden">
          {/* Rotated Frame Area for Text */}
          <div className="flex-grow flex items-center justify-center">
            <div
              className="bg-gradient-to-br from-purple-300 via-pink-300 to-rose-300 aspect-[10/12] w-full max-w-sm md:max-w-md transform rotate-[7deg] shadow-xl p-1 md:p-2 flex flex-col"
            >
              {/* Inner scrollable text container */}
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
                {/* Add more Japanese text here */}
              </div>
            </div>
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
