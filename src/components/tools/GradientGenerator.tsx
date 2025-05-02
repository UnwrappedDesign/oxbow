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
  const [fromColor, setFromColor] = useState(colorShades("blue")[8]);
  const [toColor, setToColor] = useState(colorShades("blue")[4]);
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
    <div id="generator" className="bg-base-100 ">
      <div className="z-10 bg-base-100  lg:sticky lg:top-2">
        <div className="flex items-center bg-base-100 ">
          <label className="sr-only">Mode</label>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 ">
            <button
              className={`
                            flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-black bg-white hover:bg-base-100 focus:outline-base-900 h-9 px-4 py-2 text-sm rounded-md w-full
                              ${mode === "background" ? "!outline-base-700" : "text-base-500 "}
                            `}
              onClick={() => setMode("background")}
            >
              Background
            </button>
            <button
              className={`
                          flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-black bg-white hover:bg-base-100 focus:outline-base-900 h-9 px-4 py-2 text-sm rounded-md w-full
                              ${mode === "text" ? "!outline-base-700" : "text-base-500"}
                            `}
              onClick={() => setMode("text")}
            >
              Text
            </button>
            <button
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-center text-black bg-white shadow-subtle duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 hover:bg-base-100 focus:outline-base-900 h-9 rounded-md"
              onClick={copyToClipboard}
            >
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>
        <div className="w-full pt-2 bg-base-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
          {mode === "text" && (
            <div className="w-full">
              <label className="sr-only">Your Text</label>
              <input
                className="block w-full h-10 px-3 py-2 text-sm bg-white border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-base-200 text-base-600 border-base-100 leading-6 transition-colors duration-200 ease-in-out"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          )}
          <div className="w-full">
            <label className="sr-only">Direction</label>
            <select
              className="block w-full h-10 px-3 py-2 text-sm bg-white border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-base-200 text-base-600 border-base-100 leading-6 transition-colors duration-200 ease-in-out"
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
            className="block w-full h-10 px-3 py-2 text-sm bg-white border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-base-200 text-base-600 border-base-100 leading-6 transition-colors duration-200 ease-in-out"
            value={generateTwGradient()}
          />
        </div>
        <div className="pt-2 bg-base-100 ">
          <div
            className={`flex items-center justify-center relative w-full lg:sticky  z-90 p-24 rounded-lg overflow-hidden  ${generateTwGradient()}`}
          >
            {mode === "text" ? (
              <p className="text-5xl font-bold text-center">{text}</p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center pt-2  bg-base-100 gap-x-2">
          <button
            className={` flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-black bg-white hover:bg-base-100 focus:outline-base-900 h-9 px-4 py-2 text-sm rounded-md w-full ${tab === "from" ? "!outline-base-500 " : ""}`}
            onClick={() => setTab("from")}
          >
            From Color
          </button>
          <button
            className={`  flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-black bg-white hover:bg-base-100 focus:outline-base-900 h-9 px-4 py-2 text-sm rounded-md w-full ${tab === "to" ? "!outline-base-700" : ""}`}
            onClick={() => setTab("to")}
          >
            To Color
          </button>
        </div>
      </div>
      <div className="p-8 mt-4 bg-white rounded-lg  grid grid-cols-4 gap-x-4 md:grid-cols-8 gap-y-12 lg:grid-cols-12 outline shadow-oxbow outline-base-100">
        {tailwindColors.map((color) => (
          <div>
            <p className="font-mono text-xs uppercase text-base-500 ">
              {color}
            </p>
            <div className="mt-2 grid grid-cols-1 gap-y-8 ">
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
                  <p className="font-mono text-xs uppercase text-base-500 ">
                    {colorShade.split("-")[1]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
     
    </div>
  );
}
