import { useEffect, useMemo, useState } from "react";

const colorFamilies = [
  "charcoal",
  "metal",
  "haiti",
  "purple",
  "blueBerry",
  "blue",
  "sky",
  "turquoise",
  "persianGreen",
  "pastelGreen",
  "grass",
  "carrot",
  "orange",
  "red",
  "raspberry",
  "fuchsia",
] as const;

const colorShades = [
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
type ColorFamily = (typeof colorFamilies)[number];
type ColorShade = (typeof colorShades)[number];

type GradientStop = {
  family: ColorFamily;
  shade: ColorShade;
};

const cssVarName = (stop: GradientStop) => `--color-${stop.family}-${stop.shade}`;
const stopKey = (stop: GradientStop) => `${stop.family}-${stop.shade}`;
const makeStopsForFamily = (family: ColorFamily) =>
  colorShades.map<GradientStop>((shade) => ({ family, shade }));

const gradientClassFor = (stop: GradientStop, prefix: "from" | "via" | "to") =>
  `${prefix}-[var(${cssVarName(stop)})]`;
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

type DirectionShort = (typeof directionMap)[keyof typeof directionMap];
const directionLabelMap: Record<DirectionShort, typeof directions[number]> =
  Object.entries(directionMap).reduce(
    (acc, [label, short]) => {
      acc[short as DirectionShort] = label as typeof directions[number];
      return acc;
    },
    {} as Record<DirectionShort, typeof directions[number]>,
  );
export default function GradientGenerator() {
  const [direction, setDirection] = useState(directionMap["to top right"]);
  const [fromColor, setFromColor] = useState<GradientStop>({
    family: "blue",
    shade: "800",
  });
  const [viaColor, setViaColor] = useState<GradientStop>({
    family: "blue",
    shade: "600",
  });
  const [useVia, setUseVia] = useState(false);
  const [toColor, setToColor] = useState<GradientStop>({
    family: "blue",
    shade: "400",
  });
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"from" | "via" | "to">("from");
  const [text, setText] = useState("Your Text");
  const [mode, setMode] = useState<"text" | "background">("background");

  useEffect(() => {
    if (!useVia && tab === "via") setTab("from");
  }, [useVia, tab]);

  const gradientClasses = useMemo(() => {
    return [
      `bg-gradient-to-${direction}`,
      gradientClassFor(fromColor, "from"),
      useVia ? gradientClassFor(viaColor, "via") : null,
      gradientClassFor(toColor, "to"),
    ]
      .filter(Boolean)
      .join(" ");
  }, [direction, fromColor, toColor, useVia, viaColor]);

  const gradientStyle = useMemo(() => {
    const cssDirection = directionLabelMap[direction as DirectionShort] || "to top right";
    const stops = [
      `var(${cssVarName(fromColor)})`,
      ...(useVia ? [`var(${cssVarName(viaColor)})`] : []),
      `var(${cssVarName(toColor)})`,
    ];
    return {
      backgroundImage: `linear-gradient(${cssDirection}, ${stops.join(", ")})`,
    } as const;
  }, [direction, fromColor, toColor, useVia, viaColor]);

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
                            flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-base-900 dark:text-base-100 bg-white dark:bg-base-800 hover:bg-base-100 dark:hover:bg-base-800 focus:outline-base-900 dark:focus:outline-base-100 h-9 px-4 py-2 text-sm rounded-md w-full
                              ${mode === "background" ? "!outline-base-700 dark:!outline-base-200" : "text-base-500 dark:text-base-400"}
                            `}
              onClick={() => setMode("background")}
            >
              Background
            </button>
            <button
              className={`
                          flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-base-900 dark:text-base-100 bg-white dark:bg-base-800 hover:bg-base-100 dark:hover:bg-base-800 focus:outline-base-900 dark:focus:outline-base-100 h-9 px-4 py-2 text-sm rounded-md w-full
                              ${mode === "text" ? "!outline-base-700 dark:!outline-base-200" : "text-base-500 dark:text-base-400"}
                            `}
              onClick={() => setMode("text")}
            >
              Text
            </button>
          </div>
          <button
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-center text-base-900 dark:text-base-100 bg-white dark:bg-base-800 shadow-subtle duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 hover:bg-base-100 dark:hover:bg-base-800 focus:outline-base-900 dark:focus:outline-base-100 h-9 rounded-md"
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
              className={`flex items-center justify-between w-full h-9 px-3 text-sm bg-white dark:bg-base-800 border rounded-md shadow-subtle duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-base-900 dark:focus:outline-base-100 border-base-200 dark:border-white/10 ${
                useVia ? "!outline-base-700 dark:!outline-base-200 text-base-900 dark:text-base-100" : "text-base-500 dark:text-base-400"
              }`}
            >
              <span className="select-none">Middle color</span>
              <span
                className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-300 ${
                  useVia ? "bg-base-900 dark:bg-base-100" : "bg-base-200 dark:bg-base-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-base-900 transition-transform duration-300 ${
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
                  className="block w-full h-10 px-3 py-2 text-sm bg-white dark:bg-base-800 border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-base-200 dark:focus:border-white/20 text-base-600 dark:text-base-100 border-base-100 dark:border-white/10 leading-6 transition-colors duration-200 ease-in-out"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            )}
            <div className="w-full">
              <label className="sr-only">Direction</label>
              <select
                className="block w-full h-10 px-3 py-2 text-sm bg-white dark:bg-base-800 border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-base-200 dark:focus:border-white/20 text-base-600 dark:text-base-100 border-base-100 dark:border-white/10 leading-6 transition-colors duration-200 ease-in-out"
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
              readOnly
              className="block w-full h-10 px-3 py-2 text-sm bg-white dark:bg-base-800 border rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-base-200 dark:focus:border-white/20 text-base-600 dark:text-base-100 border-base-100 dark:border-white/10 leading-6 transition-colors duration-200 ease-in-out"
              value={generateTwGradient()}
            />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div
            className={`flex items-center justify-center relative h-full w-full p-12 md:p-20 rounded-lg overflow-hidden border border-base-100 dark:border-white/10   ${
              mode === "background" ? "" : "bg-white dark:bg-base-800"
            }`}
            style={mode === "background" ? gradientStyle : undefined}
            aria-label="Gradient preview"
          >
            {mode === "text" ? (
              <p
                className="text-4xl md:text-4xl font-bold text-center bg-clip-text text-transparent"
                style={gradientStyle}
              >
                {text}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex items-center pt-4 gap-x-2">
          <button
            className={`flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-base-900 dark:text-base-100 bg-white dark:bg-base-800 hover:bg-base-100 dark:hover:bg-base-800 focus:outline-base-900 dark:focus:outline-base-100 h-9 px-4 py-2 text-sm rounded-md w-full ${tab === "from" ? "!outline-base-700 dark:!outline-base-200" : "text-base-500 dark:text-base-400"}`}
            onClick={() => setTab("from")}
          >
            From Color
          </button>
          <button
            className={`flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-base-900 dark:text-base-100 bg-white dark:bg-base-800 hover:bg-base-100 dark:hover:bg-base-800 focus:outline-base-900 dark:focus:outline-base-100 h-9 px-4 py-2 text-sm rounded-md w-full disabled:opacity-40 ${tab === "via" ? "!outline-base-700 dark:!outline-base-200" : "text-base-500 dark:text-base-400"}`}
            onClick={() => setTab("via")}
            disabled={!useVia}
          >
            Via Color
          </button>
          <button
            className={`flex items-center justify-center text-center shadow-subtle font-medium duration-500 ease-in-out transition-colors focus:outline-2 focus:outline-offset-2 text-base-900 dark:text-base-100 bg-white dark:bg-base-800 hover:bg-base-100 dark:hover:bg-base-800 focus:outline-base-900 dark:focus:outline-base-100 h-9 px-4 py-2 text-sm rounded-md w-full ${tab === "to" ? "!outline-base-700 dark:!outline-base-200" : "text-base-500 dark:text-base-400"}`}
            onClick={() => setTab("to")}
          >
            To Color
          </button>
        </div>

      <div className="p-6 mt-4 bg-white dark:bg-base-800 rounded-lg flex flex-col gap-8 outline   outline-base-100 dark:outline-white/10">
        {colorFamilies.map((family) => (
          <div key={family}>
            <p className=" text-xs uppercase text-base-500 dark:text-base-400">
              {family}
            </p>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2 ">
              {makeStopsForFamily(family).map((stop) => {
                const key = stopKey(stop);
                const isSelected =
                  tab === "from"
                    ? stopKey(fromColor) === key
                    : tab === "via"
                    ? stopKey(viaColor) === key
                    : stopKey(toColor) === key;
                return (
                  <div key={key}>
                  <button
                    style={{ backgroundColor: `var(${cssVarName(stop)})` }}
                    className={`p-4 rounded-lg w-full h-full focus:outline-none ring-offset-4 focus:ring-offset-base-950 dark:focus:ring-offset-base-100 focus:ring-white dark:focus:ring-base-100 duration-300 ${isSelected ? "ring-2" : ""}`}
                    onClick={() => {
                      if (tab === "from") setFromColor(stop);
                      else if (tab === "via") setViaColor(stop);
                      else setToColor(stop);
                    }}
                  />
                  <p className="text-xs uppercase text-base-500 dark:text-base-400 mt-1">
                    {stop.shade}
                  </p>
                </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    
    </div>
  );
}
