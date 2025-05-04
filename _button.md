

# Button Component

A flexible and accessible Button component that supports multiple variants, sizes, icons, loading states, full-width layout, and custom styles.

## Import

```js
import Button from "@/components/fundations/buttons/Button.astro";
```

## Props

| Prop           | Type                                                                                  | Default     | Description                                              |
| -------------- | ------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| `variant`      | `"default"`, `"accent"`, `"muted"`, `"alternative"`, `"link"`, `"outline"`, `"ghost"` | `"default"` | Visual style of the button.                              |
| `size`         | `"xs"`, `"sm"`, `"base"`, `"md"`, `"lg"`, `"xl"`                                      | `"base"`    | Button size.                                             |
| `onlyIconSize` | `"xs"`, `"sm"`, `"base"`, `"md"`, `"lg"`, `"xl"`                                      | —           | Use when the button has only an icon.                    |
| `gap`          | `"xs"`, `"sm"`, `"base"`, `"md"`, `"lg"`                                              | —           | Spacing between icon and text.                           |
| `loading`      | `boolean`                                                                             | `false`     | Shows a spinner and disables the button.                 |
| `fullWidth`    | `boolean`                                                                             | `false`     | Makes the button take full container width.              |
| `class`        | `string`                                                                              | —           | Custom Tailwind classes for overrides.                   |
| `href`         | `string`                                                                              | —           | If set, renders an anchor (`<a>`) instead of `<button>`. |
| `target`       | `string`                                                                              | —           | Target for the anchor tag, e.g. `_blank`.                |
| `rel`          | `string`                                                                              | —           | Rel attribute for external links.                        |
| `...rest`      | `any`                                                                                 | —           | All other native button or anchor props.                 |

## Icon Slots

* `slot="left-icon"` – Display an icon before the label
* `slot="right-icon"` – Display an icon after the label

Example:

```js
<Button variant="accent" gap="sm">
  <svg slot="left-icon" ... />
  Save Changes
</Button>
```

## States

* **Loading**: Use `loading` to show a spinner and prevent interaction.
* **Disabled**: Use `disabled` prop to disable the button.
* **Icon-only**: Use `onlyIconSize` or let it auto-detect if there's only an icon slot and no label.

## Styling

You can override or extend styles using the `class` prop:

```js
<Button class="text-white bg-indigo-600 hover:bg-indigo-700">
  Custom Style
</Button>
```


