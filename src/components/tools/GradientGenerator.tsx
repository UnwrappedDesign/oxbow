import { useState } from "react";

const tailwindColors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "amber",
  "lime",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "violet",
  "fuchsia",
  "purple",
  "rose",
] as const;

const tailwindColorShades = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
] as const;

const directions = [
  "to top",
  "to top right",
  "to right",
  "to bottom right",
  "to bottom",
  "to bottom left",
  "to left",
  "to top left",
] as const;

type TwColors = (typeof tailwindColors)[number];

const colorShades = (color: TwColors) =>
  tailwindColorShades.map((shade) => `${color}-${shade}` as const);

const directionMap = {
  "to top": "t",
  "to top right": "tr",
  "to right": "r",
  "to bottom right": "br",
  "to bottom": "b",
  "to bottom left": "bl",
  "to left": "l",
  "to top left": "tl",
} as const;

export default function GradientGenerator() {
  const [direction, setDirection] = useState(directionMap["to right"]);
  const [fromColor, setFromColor] = useState(colorShades("indigo")[3]);
  const [toColor, setToColor] = useState(colorShades("blue")[8]);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"from" | "to">("from");
  const [text, setText] = useState("Hello World");
  const [mode, setMode] = useState<"text" | "background">("background");

  const generateTwGradient = () => {
    return `bg-gradient-to-${direction} from-${fromColor} to-${toColor} ${mode === "text" && "bg-clip-text text-transparent"}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateTwGradient());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      id="generator"
      className="max-w-7xl mx-auto p-4 bg-white lg:p-8 scroll-mt-6 rounded-xl shadow-xl border border-gray-200"
    >
      <div className="relative lg:flex lg:space-x-10 xl:space-x-16 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div className="w-full lg:w-1/2 xl:w-2/5">
          <div className={`flex items-center justify-center relative w-full rounded-xl h-72 md:h-96 xl:h-[20rem] ${generateTwGradient()}`}>
            {mode === "text" ? <p className="text-8xl font-bold text-center">{text}</p> : null}
          </div>
        </div>
        <div className="w-full mt-4 lg:w-1/2 xl:w-3/5 lg:mt-0 mb-4">
          <label className="font-medium text-gray-500">Mode</label>
          <div className="flex items-center gap-2 mb-4">
            <button
              className={`
                      pointer-events-auto flex focus:text-accent-500 rounded-md px-4 h-7 py-1 text-sm  transition focus-visible:outline-none focus-visible:ring focus-visible:ring-base-200
                      ${mode === "background" ? "bg-white text-accent-500" : "text-base-500 "}
                    `}
              onClick={() => setMode("background")}
            >
              Background
            </button>
            <button
              className={`
                      pointer-events-auto flex focus:text-accent-500 rounded-md px-4 h-7 py-1 text-sm  transition focus-visible:outline-none focus-visible:ring focus-visible:ring-base-200
                      ${mode === "text" ? "bg-white text-accent-500" : "text-base-500"}
                    `}
              onClick={() => setMode("text")}
            >
              Text
            </button>
          </div>
          <div className="md:flex md:items-center md:space-x-4">
            <div className="mt-4 md:w-1/2 md:mt-0">
              <label className="font-medium text-gray-500">Direction</label>
              <select className="block w-full px-4 py-2 h-10 border-2 focus:ring-2 focus:ring-accent-500 bg-chalk border-transparent ring-1 ring-base-200 duration-300 rounded-lg appearance-none text-accent-500 placeholder-base-300 focus:border-accent-300 focus:outline-none sm:text-sm" value={direction} onChange={(e) => setDirection(e.target.value as any)}>
                {directions.map((dir) => (
                  <option key={dir} className="px-4 py-3 cursor-pointer hover:bg-gray-50" value={directionMap[dir]}>
                    {dir}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 sm:flex sm:items-center sm:space-x-4 lg:block lg:space-x-0 xl:flex xl:space-x-4">
            <input
              disabled
              className="block w-full px-4 py-2 h-10  border-2 focus:ring-2 focus:ring-accent-500 bg-chalk border-transparent ring-1 ring-base-200 duration-300 rounded-lg appearance-none text-accent-500 placeholder-base-300 focus:border-accent-300 focus:outline-none sm:text-sm"
              value={generateTwGradient()}
            />
            <button className="pointer-events-auto relative w-32 flex rounded-md focus:text-accent-500 py-1 text-sm text-base-900 transition focus-visible:outline-none focus-visible:ring focus-visible:ring-base-200"
              onClick={copyToClipboard}
            >
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
          <div className="mt-6 relative lg:flex">
            {mode === "text" && (
              <div className="w-full mb-4">
                <div>
                  <label className="font-medium text-gray-500">Your Text</label>
                  <input 
                    className="block w-full px-4 py-2 h-10 border-2 focus:ring-2 focus:ring-accent-500 bg-chalk border-transparent ring-1 ring-base-200 duration-300 rounded-lg appearance-none text-accent-500 placeholder-base-300 focus:border-accent-300 focus:outline-none sm:text-sm"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative mt-12 lg:flex">
        <div className="lg:w-1/2 xl:w-3/5">
          <div className="flex flex-col flex-1 max-h-64 md:max-h-96 xl:max-h-[20rem]">
            <div className="flex items-center space-x-8">
              <button className={`hover:text-gray-600 font-semibold transition-colors duration-300 focus:outline-none ${tab === "from" ? "text-gray-800" : "text-gray-400"}`}onClick={() => setTab("from")}>
                From Color
              </button>
              <button className={` hover:text-gray-600 font-semibold transition-colors duration-300 focus:outline-none ${tab === "to" ? "text-gray-800" : "text-gray-400"}`} onClick={() => setTab("to")}>
                To Color
              </button>
            </div>
            <div className="relative flex-1 w-full h-64 px-6 py-4 mt-4 space-y-6 overflow-y-auto border rounded-lg">
              {tailwindColors.map((color) => (
                <div>
                  <p className="text-gray-800 font-semibold">{color}</p>
                  <div className="grid grid-cols-5 gap-4 md:gap-4 2xl:gap-4 sm:grid-cols-5 md:grid-cols-10 lg:grid-cols-5 xl:grid-cols-10">
                    {colorShades(color).map((colorShade) => (
                      <div>
                        <button 
                          className={`w-full h-10 sm:h-11 rounded-lg md:h-10 2xl:h-11 focus:outline-none bg-${colorShade} 
                          ${tab === "from" ? (fromColor === colorShade ? "ring-2 ring-gray-800" : "") : (toColor === colorShade ? "ring-2 ring-gray-800" : "")}`}
                          onClick={() => {
                            if (tab === "from") {
                              setFromColor(colorShade);
                            } else {
                              setToColor(colorShade);
                            }
                          }}
                        >
                        </button>
                        <p className="mt-1 text-sm text-center text-gray-500 font-medium">
                          {colorShade.split("-")[1]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
