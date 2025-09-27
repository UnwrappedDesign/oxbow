# Button Usage Guide

A quick reference for working with the shared `Button` component in Astro views.

## Import

```astro
import Button from "@/components/fundations/buttons/Button.astro";
```

## Variants

| Variant        | When to use                                                                 |
| -------------- | ---------------------------------------------------------------------------- |
| `default`      | Primary actions with neutral brand styling                                   |
| `accent`       | High emphasis primary action                                                 |
| `accentDark`   | Darker accent tone for contrasting surfaces (internal use)                   |
| `muted`        | Low emphasis, soft backgrounds                                               |
| `alternative`  | Alternate neutral treatment                                                  |
| `outline`      | Quiet actions on busy backgrounds                                            |
| `ghost`        | Minimal emphasis, ghosted background                                         |
| `text`         | Text-style button on light backgrounds                                       |
| `link`         | Inline links that need button behaviour                                      |
| `info`/`success`/`warning`/`danger` | Semantic states for status messaging                    |
| `onlyIcon`/`icon` | Icon-only buttons (auto-applies square sizing)                            |
| `oxbow*`       | Product-only themes (not exposed to the public design system)                |

> For icon-only buttons you can also keep `variant="accent"` and set `iconOnly` to `true`.

## Sizes

```astro
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="base">Base</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

Icon-only buttons can opt into `onlyIconSize` if you need a different token than the label buttons:

```astro
<Button onlyIconSize="sm" aria-label="Search">
  <Magnifier slot="left-icon" />
</Button>
```

## Slots for Icons

- `slot="left-icon"`: places an icon before the label.
- `slot="right-icon"`: places an icon after the label.

```astro
<Button variant="accent" gap="xs">
  <IconPlus slot="left-icon" size="sm" />
  New project
</Button>
```

Set the `gap` prop (`xxs`, `xs`, `sm`, `base`, `md`, `lg`) to control spacing between slot content and the label. If you omit `gap`, a sensible default is applied when both icon and label are present.

## Link vs Button

- Provide `href` to render an anchor (`<a>`) with accessible focus/disabled handling.
- Omit `href` to use the semantic `<button>`.

```astro
<Button href="/pricing" variant="link">See pricing</Button>
<Button type="submit" variant="accent">Submit</Button>
```

## States

- `loading`: shows a built-in spinner overlay and suppresses interaction.
- `disabled`: respects the HTML disabled state and applies disabled styling.
- `fullWidth`: expands the button to fill the parent container width.
- `iconOnly`: forces icon-only sizing even when a label slot is present.

```astro
<Button loading variant="outline">Loading...</Button>
<Button disabled variant="ghost">Disabled</Button>
<Button fullWidth variant="default">Continue</Button>
<Button variant="accent" iconOnly aria-label="Add">
  <IconPlus slot="left-icon" size="sm" />
</Button>
```

## Rounding Overrides

Use `noRounded` to remove all rounding, or combine per-edge overrides (`noRoundedTop`, `noRoundedBottom`, `noRoundedLeft`, `noRoundedRight`) and per-corner overrides (`noRoundedBottomLeft`, etc.) when buttons sit in groups.

```astro
<Button variant="muted" noRounded>Flat edges</Button>
<Button variant="muted" noRoundedLeft>Group start</Button>
<Button variant="muted" noRoundedRight>Group end</Button>
<Button variant="muted" noRoundedTop>Top edge flat</Button>
<Button variant="muted" noRoundedBottom>Bottom edge flat</Button>
```

## Custom Styling

Add Tailwind classes with the `class` prop when you need a bespoke treatment.

```astro
<Button class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
  Gradient CTA
</Button>
```

> Prefer adding a formal variant for commonly reused styling so downstream teams don’t rely on ad-hoc class overrides.

## Accessibility

- Always provide `aria-label` with icon-only buttons.
- The component manages `tabindex` for disabled states and sets `aria-busy` while loading.

```astro
<Button variant="accent" iconOnly size="sm" aria-label="Search">
  <IconSearch slot="left-icon" />
</Button>
```

> Use the neutral `onlyIcon` variant only when you need the shared icon button styling. For semantic or brand colours (e.g. `info`, `accent`), keep the variant you want and add `iconOnly`.

## Example Layouts

See the ready-made demos under `src/components/oxbow/application/buttons/` for quick copy/paste scenarios:

- `01.astro`: Default size scale
- `02.astro`: Oxbow product variants
- `03.astro`: Accent / Accent Dark
- `04.astro`: Muted / Alternative
- `05.astro`: Outline
- `06.astro`: Semantic status
- `07.astro`: Icon-only
- `08.astro`: Left icon
- `09.astro`: Right icon
- `10.astro`: Ghost / Text / Link

Use these as references when composing new modules or documenting component behaviour.
