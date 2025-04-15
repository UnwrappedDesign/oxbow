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
      <div className="lg:sticky lg:top-2 z-10 bg-base-50 dark:bg-base-950">
        <div className="flex  items-center   bg-base-50 dark:bg-base-950 ">
          <label className="sr-only">Mode</label>
          <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2 ">
            <button
              className={`
                            flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none  focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring active:inset-shadow-transparent dark:text-white dark:bg-linear-to-r/oklch dark:from-base-900 dark:to-base-950  dark:hover:bg-base-400 dark:focus:outline-base-900 dark:ring-base-900 text-black bg-linear-10 from-base-100 to-base-200  hover:bg-base-400 focus:outline-base-200 ring-base-200 h-10 px-8 py-3 text-base rounded-lg gap-4 w-full sm:w-auto
                              ${mode === "background" ? "!outline-base-700" : "text-base-500 "}
                            `}
              onClick={() => setMode("background")}
            >
              Background
            </button>
            <button
              className={`
                          flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none  focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring active:inset-shadow-transparent dark:text-white dark:bg-linear-to-r/oklch dark:from-base-900 dark:to-base-950  dark:hover:bg-base-400 dark:focus:outline-base-900 dark:ring-base-900 text-black bg-linear-10 from-base-100 to-base-200  hover:bg-base-400 focus:outline-base-200 ring-base-200 h-10 px-8 py-3 text-base rounded-lg gap-4 w-full sm:w-auto
                              ${mode === "text" ? "!outline-base-700" : "text-base-500"}
                            `}
              onClick={() => setMode("text")}
            >
              Text
            </button>
            <button
              className="flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none  focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring active:inset-shadow-transparent dark:text-white dark:bg-linear-to-r/oklch dark:from-base-900 dark:to-base-950  dark:hover:bg-base-400 dark:focus:outline-base-900 dark:ring-base-900 text-black bg-linear-10 from-base-100 to-base-200  hover:bg-base-400 focus:outline-base-200 ring-base-200 h-10 px-8 py-3 text-base rounded-lg gap-4 w-full sm:w-auto"
              onClick={copyToClipboard}
            >
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-2 w-full bg-base-50 dark:bg-base-950">
          {mode === "text" && (
            <div className="w-full">
              <label className="sr-only">Your Text</label>
              <input
                className="block w-full h-12 px-4 py-2 text-sm text-black dark:text-white duration-300 bg-white dark:bg-black/50 backdrop-blur-2xl border border-transparent rounded-xl appearance-none outline outline-base-100 dark:outline-base-900 placeholder-base-400 focus:border-base-100 dark:focus:border-base-900 focus:bg-transparent focus:outline-none focus:outline-accent-500 focus:outline-offset-2 focus:outline-2 sm:text-sm focus:ring-offset-base-950 dark:focus:ring-offset-base-950"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          )}
          <div className="w-full">
            <label className="sr-only">Direction</label>
            <select
              className="block w-full h-12 px-4 py-2 text-sm text-black dark:text-white duration-300 bg-white dark:bg-black/50 backdrop-blur-2xl border border-transparent rounded-xl appearance-none outline outline-base-100 dark:outline-base-900 placeholder-base-400 focus:border-base-100 dark:focus:border-base-900 focus:bg-transparent focus:outline-none focus:outline-accent-500 focus:outline-offset-2 focus:outline-2 sm:text-sm focus:ring-offset-base-950 dark:focus:ring-offset-base-950"
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
            className="block w-full h-12 px-4 py-2 text-sm text-black dark:text-white duration-300 bg-white dark:bg-black/50 backdrop-blur-2xl border border-transparent rounded-xl appearance-none outline outline-base-100 dark:outline-base-900 placeholder-base-400 focus:border-base-100 dark:focus:border-base-900 focus:bg-transparent focus:outline-none focus:outline-accent-500 focus:outline-offset-2 focus:outline-2 sm:text-sm focus:ring-offset-base-950 dark:focus:ring-offset-base-950"
            value={generateTwGradient()}
          />
        </div>
        <div className="pt-2 bg-base-50 dark:bg-base-950">
          <div
            className={`flex items-center justify-center relative w-full  lg:sticky  z-90  p-24 outline rounded-xl outline-base-100 dark:outline-base-900 shadow dark:shadow-2xl dark:shadow-black overflow-hidden    ${generateTwGradient()}`}
          >
            {mode === "text" ? (
              <p className="text-5xl font-bold text-center">{text}</p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-x-2  mt-2  bg-base-50 dark:bg-base-950 p-4 outline rounded-xl outline-base-100 dark:outline-base-900 shadow dark:shadow-2xl dark:shadow-black">
          <button
            className={` flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none  focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring active:inset-shadow-transparent dark:text-white dark:bg-linear-to-r/oklch dark:from-base-900 dark:to-base-950  dark:hover:bg-base-400 dark:focus:outline-base-900 dark:ring-base-900 text-black bg-linear-10 from-base-100 to-base-200  hover:bg-base-400 focus:outline-base-200 ring-base-200 h-8 px-6 py-2 text-xs rounded-md gap-4 w-full sm:w-auto ${tab === "from" ? "!outline-base-500 " : ""}`}
            onClick={() => setTab("from")}
          >
            From Color
          </button>
          <button
            className={`  flex relative text-center font-medium items-center shadow-button justify-center overflow-hidden border border-transparent duration-300 ease-in-out transition-all outline-offset-4 hover:opacity-90 hover:shadow-none focus-visible:outline-none  focus:outline-2 inset-shadow-xs inset-shadow-white/10 ring active:inset-shadow-transparent dark:text-white dark:bg-linear-to-r/oklch dark:from-base-900 dark:to-base-950  dark:hover:bg-base-400 dark:focus:outline-base-900 dark:ring-base-900 text-black bg-linear-10 from-base-100 to-base-200  hover:bg-base-400 focus:outline-base-200 ring-base-200 h-8 px-6 py-2 text-xs rounded-md gap-4 w-full sm:w-auto ${tab === "to" ? "!outline-base-700" : ""}`}
            onClick={() => setTab("to")}
          >
            To Color
          </button>
        </div>
      </div>
      <div className=" grid grid-cols-4 gap-x-4 md:grid-cols-8 gap-y-12 lg:grid-cols-12 mt-4  outline rounded-xl outline-base-100 dark:outline-base-900 shadow dark:shadow-2xl dark:shadow-black p-8 bg-white dark:bg-base-950">
        {tailwindColors.map((color) => (
          <div>
            <p className="text-base-500 dark:text-white font-mono uppercase  text-xs ">
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
                  <p className="text-base-500 dark:text-base-300 font-mono uppercase  text-xs">
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
