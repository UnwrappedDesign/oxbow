import { useState } from "react";

const tailwindColors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "gray",
  "stone",
  "zinc",
  "neutral",
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
  const [direction, setDirection] = useState(directionMap["to top right"]);
  const [fromColor, setFromColor] = useState(colorShades("neutral")[8]);
  const [toColor, setToColor] = useState(colorShades("neutral")[6]);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"from" | "to">("from");
  const [text, setText] = useState("Your Text");
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
    <div id="generator">
    
      <div className="lg:sticky lg:top-0 z-10 bg-base-950">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
          {mode === "text" && (
              <div className="w-full">
                <label className="sr-only">Your Text</label>
                <input
                  className="block w-full h-12 px-4 py-2 text-sm text-white duration-300 bg-black/50 backdrop-blur-2xl border border-transparent rounded-xl appearance-none outline outline-base-900 placeholder-base-400 focus:border-base-900 focus:bg-transparent focus:outline-none focus:outline-accent-500 focus:outline-offset-2 focus:outline-2 sm:text-sm focus:ring-offset-base-950 apearence-none"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            )}
           <div className="w-full">
              <label className="sr-only">Direction</label>
              <select
                className="block w-full h-12 px-4 py-2 text-sm text-white duration-300 bg-black/50 backdrop-blur-2xl border border-transparent rounded-xl appearance-none outline outline-base-900 placeholder-base-400 focus:border-base-900 focus:bg-transparent focus:outline-none focus:outline-accent-500 focus:outline-offset-2 focus:outline-2 sm:text-sm focus:ring-offset-base-950 apearence-none"
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
              >
                {directions.map((dir) => (
                  <option
                    key={dir}
                    className="px-4 py-3 cursor-pointer hover:bg-base-50"
                    value={directionMap[dir]}
                  >
                    {dir}
                  </option>
                ))}
              </select>
           </div>
            <input
              disabled
              className="block w-full h-12 px-4 py-2 text-sm text-white duration-300 bg-black/50 backdrop-blur-2xl border border-transparent rounded-xl appearance-none outline outline-base-900 placeholder-base-400 focus:border-base-900 focus:bg-transparent focus:outline-none focus:outline-accent-500 focus:outline-offset-2 focus:outline-2 sm:text-sm focus:ring-offset-base-950 apearence-none"
              value={generateTwGradient()}
            />
            <button
              className="flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none  focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring  active:inset-shadow-transparent text-white bg-linear-to-r/oklch from-base-900 to-base-950  hover:bg-base-400 focus:outline-base-900 ring-base-900 h-12 px-8 py-3 text-base rounded-lg w-full"
              onClick={copyToClipboard}
            >
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
           
          </div>
        
         
       
        <div className="">
          <div className="flex  items-center  py-2 ">
            <label className="sr-only">Mode</label>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2 ">
              <button
                className={`
                            flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none  focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring  active:inset-shadow-transparent text-white bg-linear-to-r/oklch from-base-900 to-base-950  hover:bg-base-400 focus:outline-base-900 ring-base-900 h-12 px-8 py-3 text-base rounded-lg w-full
                              ${mode === "background" ? "!outline-base-700" : "text-base-500 "}
                            `}
                onClick={() => setMode("background")}
              >
                Background
              </button>
              <button
                className={`
                          flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none  focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring  active:inset-shadow-transparent text-white bg-linear-to-r/oklch from-base-900 to-base-950  hover:bg-base-400 focus:outline-base-900 ring-base-900 h-12 px-8 py-3 text-base rounded-lg w-full
                              ${mode === "text" ? "!outline-base-700" : "text-base-500"}
                            `}
                onClick={() => setMode("text")}
              >
                Text
              </button>
            </div>
          </div>
  
          <div
            className={`flex items-center justify-center relative w-full  lg:sticky  z-90  p-24 outline rounded-xl outline-base-900 shadow-2xl shadow-black overflow-hidden    ${generateTwGradient()}`}
          >
            {mode === "text" ? (
              <p className="text-5xl font-bold text-center">{text}</p>
            ) : null}
          </div>
        </div>
      <div className="flex items-center gap-x-8 pt-8 bg-base-950 border-b border-base-800 pb-4">
        <button
          className={` flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring active:inset-shadow-transparent text-white bg-linear-to-r/oklch from-base-900 to-base-950 hover:bg-base-400 focus:outline-base-900 ring-base-900 h-7 px-4 py-1.5 text-xs rounded-sm pointer-events-auto ${tab === "from" ? "!outline-base-700" : ""}`}
          onClick={() => setTab("from")}
        >
          From Color
        </button>
        <button
          className={`  flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring active:inset-shadow-transparent text-white bg-linear-to-r/oklch from-base-900 to-base-950 hover:bg-base-400 focus:outline-base-900 ring-base-900 h-7 px-4 py-1.5 text-xs rounded-sm pointer-events-auto ${tab === "to" ? "!outline-base-700" : ""}`}
          onClick={() => setTab("to")}
        >
          To Color
        </button>
      </div>
      </div>

      <div className=" grid grid-cols-4 gap-x-4 md:grid-cols-8 gap-y-12 lg:grid-cols-12 mt-4  ">
        {tailwindColors.map((color) => (
          <div>
            <p className="text-base-400 font-mono uppercase font-thin text-xs ">
              {color}
            </p>
            <div className="grid grid-cols-1 gap-y-8  mt-2">
              {colorShades(color).map((colorShade) => (
                <div>
                  <button
                    className={`size-12 aspect-square rounded-lg w-full h-full focus:outline-none ring-offset-4 focus:ring-offset-base-950 focus:ring-white duration-300 bg-${colorShade} 
                            ${tab === "from" ? (fromColor === colorShade ? "ring-2  " : "") : toColor === colorShade ? "ring-2  " : ""}`}
                    onClick={() => {
                      if (tab === "from") {
                        setFromColor(colorShade);
                      } else {
                        setToColor(colorShade);
                      }
                    }}
                  ></button>
                  <p className=" text-base-300 font-mono uppercase font-thin text-xs">
                    {colorShade.split("-")[1]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col flex-1 "></div>
    </div>
  );
}
