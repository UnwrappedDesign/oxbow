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
  const [direction, setDirection] = useState(directionMap["to right"]);
  const [fromColor, setFromColor] = useState(colorShades("blue")[4]);
  const [toColor, setToColor] = useState(colorShades("blue")[6]);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"from" | "to">("from");
  const [text, setText] = useState("Oxbow UI");
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
    
      <div className="lg:sticky lg:top-0 z-10 ">
        <div className="grid grid-cols-1 lg:grid-cols-4  md:items-end  w-full bg-white border-x border-base-200">
          <div className="w-full">
            <label className="sr-only">Direction</label>
            <select
              className="block w-full px-4 py-2 h-12   focus:ring-2 focus:ring-accent-500 bg-chalk border border-base-200 duration-300  appearance-none text-accent-500 placeholder-base-300 focus:border-accent-300 focus:outline-none sm:text-sm"
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
          <div className="flex flex-col md:flex-row  lg:col-span-2 bg-white">
            <input
              disabled
              className="block w-full px-4 py-2 h-12   focus:ring-2 focus:ring-accent-500 bg-chalk border border-base-200 duration-300  appearance-none text-accent-500 placeholder-base-300 focus:border-accent-300 focus:outline-none sm:text-sm"
              value={generateTwGradient()}
            />
            <button
              className="pointer-events-auto relative bg-base-50 px-4 justify-center items-center  h-12 flex rounded-full focus:text-accent-500 py-1 text-sm text-base-900 transition focus-visible:outline-none focus-visible:ring focus-visible:ring-base-200 w-full"
              onClick={copyToClipboard}
            >
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
          <div className=" relative lg:flex w-full ">
            {mode === "text" && (
              <div className="w-full">
                <label className="text-base-500 text-base">Your Text</label>
                <input
                  className="block w-full px-4 py-2 h-10 border-2 focus:ring-2 focus:ring-accent-500 bg-chalk border-transparent ring-1 ring-base-200 duration-300 rounded-lg appearance-none text-accent-500 placeholder-base-300 focus:border-accent-300 focus:outline-none sm:text-sm"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="  bg-white border-x border-base-200">
          <div className="flex  items-center  py-2 bg-white">
            <label className="text-base-500 text-base">Mode</label>
            <div className="block h-6 mx-4 w-px bg-base-200"></div>
            <div className="flex items-center gap-2 ">
              <button
                className={`
                              pointer-events-auto flex focus:text-accent-500 rounded-md px-4 h-7 py-1 text-sm  transition focus-visible:outline-none focus-visible:ring focus-visible:ring-base-200
                              ${mode === "background" ? "bg-base-50 text-accent-500" : "text-base-500 "}
                            `}
                onClick={() => setMode("background")}
              >
                Background
              </button>
              <button
                className={`
                              pointer-events-auto flex focus:text-accent-500 rounded-md px-4 h-7 py-1 text-sm  transition focus-visible:outline-none focus-visible:ring focus-visible:ring-base-200
                              ${mode === "text" ? "bg-base-50 text-accent-500" : "text-base-500"}
                            `}
                onClick={() => setMode("text")}
              >
                Text
              </button>
            </div>
          </div>
  
          <div
            className={`flex items-center justify-center relative w-full  lg:sticky    p-32  ${generateTwGradient()}`}
          >
            {mode === "text" ? (
              <p className="text-8xl font-bold text-center">{text}</p>
            ) : null}
          </div>
        </div>
      <div className="flex items-center gap-x-8 pt-8 border-x  border-b border-base-200 bg-white">
        <button
          className={`text-base-500 text-base ${tab === "from" ? "text-base-800" : "text-base-400"}`}
          onClick={() => setTab("from")}
        >
          From Color
        </button>
        <button
          className={` text-base-500 text-base ${tab === "to" ? "text-base-800" : "text-base-400"}`}
          onClick={() => setTab("to")}
        >
          To Color
        </button>
      </div>
      </div>

      <div className="border-t pt-2 border-base-200 bg-white  mt-4 grid grid-cols-1 gap-x-4 md:grid-cols-2 gap-y-24 lg:grid-cols-11">
        {tailwindColors.map((color) => (
          <div>
            <p className="text-base-500 text-xs font-medium capitalize">
              {color}
            </p>
            <div className="flex flex-col gap-y-8  mt-2">
              {colorShades(color).map((colorShade) => (
                <div>
                  <button
                    className={`w-full  h-12   focus:outline-none bg-${colorShade} 
                            ${tab === "from" ? (fromColor === colorShade ? "ring-2 ring-base-200 ring-offset-2" : "") : toColor === colorShade ? "ring-2 ring-base-200" : ""}`}
                    onClick={() => {
                      if (tab === "from") {
                        setFromColor(colorShade);
                      } else {
                        setToColor(colorShade);
                      }
                    }}
                  ></button>
                  <p className=" text-base-500 text-xs font-medium capitalize">
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
