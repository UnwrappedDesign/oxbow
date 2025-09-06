import { useEffect, useState } from "react";
const tailwindColors = [
  // Tailwind v4 default palette families
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
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
  "950",
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
  const [viaColor, setViaColor] = useState(colorShades("blue")[6]);
  const [useVia, setUseVia] = useState(false);
  const [toColor, setToColor] = useState(colorShades("blue")[4]);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"from" | "via" | "to">("from");
  const [text, setText] = useState("Your Text");
  const [mode, setMode] = useState<"text" | "background">("background");

  useEffect(() => {
    if (!useVia && tab === "via") setTab("from");
  }, [useVia, tab]);
  const gradientClasses = [
    `bg-gradient-to-${direction}`,
    `from-${fromColor}`,
    useVia ? `via-${viaColor}` : null,
    `to-${toColor}`,
  ]
    .filter(Boolean)
    .join(" ");

  const generateTwGradient = () => {
    // Class string to copy based on mode (no stray "false" token)
    return mode === "text"
      ? `${gradientClasses} bg-clip-text text-transparent`
      : gradientClasses;
  };
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateTwGradient());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  };
  return (
    <div id="generator">
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="sr-only">Mode</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
            <button
              className={`
                            flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-black bg-white hover:bg-zinc-100 focus:outline-zinc-900 h-9 px-4 py-2 text-sm rounded-md w-full
                              ${mode === "background" ? "!outline-zinc-700" : "text-zinc-500 "}
                            `}
              onClick={() => setMode("background")}
            >
              Background
            </button>
            <button
              className={`
                          flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-black bg-white hover:bg-zinc-100 focus:outline-zinc-900 h-9 px-4 py-2 text-sm rounded-md w-full
                              ${mode === "text" ? "!outline-zinc-700" : "text-zinc-500"}
                            `}
              onClick={() => setMode("text")}
            >
              Text
            </button>
          </div>
          <button
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-center text-black bg-white shadow-subtle duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 hover:bg-zinc-100 focus:outline-zinc-900 h-9 rounded-md"
            onClick={copyToClipboard}
            aria-live="polite"
          >
            <span>{copied ? "Copied!" : "Copy classes"}</span>
          </button>
          <button
              type="button"
              role="switch"
              aria-checked={useVia}
              onClick={() => setUseVia((v) => !v)}
              className={`flex items-center justify-between w-full h-9 px-3 text-sm bg-white border rounded-md shadow-subtle duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-zinc-900 border-zinc-200 ${
                useVia ? "!outline-zinc-700 text-zinc-900" : "text-zinc-500"
              }`}
            >
              <span className="select-none">Middle color</span>
              <span
                className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-300 ${
                  useVia ? "bg-zinc-900" : "bg-zinc-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    useVia ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </span>
            </button>
          <div className="grid grid-cols-1 gap-2">
            {mode === "text" && (
              <div className="w-full">
                <label className="sr-only">Your Text</label>
                <input
                  className="block w-full h-10 px-3 py-2 text-sm bg-white border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-zinc-200 text-zinc-600 border-zinc-100 leading-6 transition-colors duration-200 ease-in-out"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            )}
            <div className="w-full">
              <label className="sr-only">Direction</label>
              <select
                className="block w-full h-10 px-3 py-2 text-sm bg-white border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-zinc-200 text-zinc-600 border-zinc-100 leading-6 transition-colors duration-200 ease-in-out"
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
              >
                {directions.map((dir) => (
                  <option
                    key={dir}
                    className="px-4 py-3 cursor-pointer hover:bg-zinc-50"
                    value={directionMap[dir]}
                  >
                    {dir}
                  </option>
                ))}
              </select>
            </div>
            <input
              readOnly
              className="block w-full h-10 px-3 py-2 text-sm bg-white border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-zinc-200 text-zinc-600 border-zinc-100 leading-6 transition-colors duration-200 ease-in-out"
              value={generateTwGradient()}
            />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div
            className={`flex items-center justify-center relative h-full w-full p-12 md:p-20 rounded-lg overflow-hidden border border-zinc-100 shadow-oxbow ${
              mode === "background" ? gradientClasses : "bg-white"
            }`}
            aria-label="Gradient preview"
          >
            {mode === "text" ? (
              <p className={`text-4xl md:text-4xl font-bold text-center ${generateTwGradient()}`}>{text}</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex items-center pt-4  gap-x-2">
          <button
            className={` flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-black bg-white hover:bg-zinc-100 focus:outline-zinc-900 h-9 px-4 py-2 text-sm rounded-md w-full ${tab === "from" ? "!outline-zinc-500 " : ""}`}
            onClick={() => setTab("from")}
          >
            From Color
          </button>
          <button
            className={` flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-black bg-white hover:bg-zinc-100 focus:outline-zinc-900 h-9 px-4 py-2 text-sm rounded-md w-full disabled:opacity-40 ${tab === "via" ? "!outline-zinc-700" : ""}`}
            onClick={() => setTab("via")}
            disabled={!useVia}
          >
            Via Color
          </button>
          <button
            className={`  flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-black bg-white hover:bg-zinc-100 focus:outline-zinc-900 h-9 px-4 py-2 text-sm rounded-md w-full ${tab === "to" ? "!outline-zinc-700" : ""}`}
            onClick={() => setTab("to")}
          >
            To Color
          </button>
        </div>

      <div className="p-6 mt-4 bg-white rounded-lg grid grid-cols-4 gap-x-4 md:grid-cols-8 gap-y-12 lg:grid-cols-12 outline shadow-oxbow outline-zinc-100">
        {tailwindColors.map((color) => (
          <div key={color}>
            <p className="font-mono text-xs uppercase text-zinc-500 ">
              {color}
            </p>
            <div className="mt-2 grid grid-cols-1 gap-y-8 ">
              {colorShades(color).map((colorShade) => (
                <div key={colorShade}>
                  <button
                    className={`size-12 aspect-square rounded-lg w-full h-full focus:outline-none ring-offset-4 focus:ring-offset-zinc-950 focus:ring-white duration-300 bg-${colorShade} 
                            ${
                              tab === "from"
                                ? fromColor === colorShade
                                  ? "ring-2"
                                  : ""
                                : tab === "via"
                                ? viaColor === colorShade
                                  ? "ring-2"
                                  : ""
                                : toColor === colorShade
                                ? "ring-2"
                                : ""
                            }`}
                    onClick={() => {
                      if (tab === "from") setFromColor(colorShade);
                      else if (tab === "via") setViaColor(colorShade);
                      else setToColor(colorShade);
                    }}
                  ></button>
                  <p className="font-mono text-xs uppercase text-zinc-500 ">
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
