Absolutely — here’s the full Markdown content for your `Input` component documentation. You can copy and paste it directly into your project:

---

````md
# Input Component Usage

The `Input` component supports multiple HTML input types with consistent styling, variants, and sizes. It unifies `input`, `textarea`, `select`, `checkbox`, and `radio` under a single flexible component.

## Props

| Prop        | Type                      | Default         | Description                                                                 |
|-------------|---------------------------|-----------------|-----------------------------------------------------------------------------|
| `as`        | `"input" \| "textarea" \| "select" \| "checkbox" \| "radio"` | `"input"`         | Type of element to render                                                   |
| `type`      | `string`                  | `"text"`        | HTML input type (only used if `as="input"`)                                |
| `id`        | `string`                  | —               | Input `id` (used for accessibility and labels)                              |
| `name`      | `string`                  | —               | Input `name` attribute                                                      |
| `label`     | `string`                  | —               | Label shown above the input (except for checkbox/radio, which are inline)  |
| `error`     | `string`                  | —               | Displays error message and styles the input as invalid                      |
| `options`   | `Array<{ label, value }>` | `[]`            | Used for `select` and `radio` inputs                                       |
| `variant`   | `"default" \| "dark" \| "transparent-light" \| "transparent-dark"` | `"default"` | Visual style of the input                                                   |
| `size`      | `"xs" \| "sm" \| "base" \| "md" \| "lg"` | `"base"`       | Input size                                                                  |
| `class`     | `string`                  | `""`            | Extra Tailwind utility classes                                              |
| `...rest`   | —                         | —               | Any other native input attributes (like `placeholder`, `required`, etc.)   |

---

## Input Types

```js
<!-- Basic input -->
<Input id="email" name="email" type="email" label="Email" placeholder="Enter your email" />

<!-- Textarea -->
<Input as="textarea" id="message" name="message" label="Message" placeholder="Your message" rows="4" />

<!-- Select -->
<Input
  as="select"
  id="country"
  name="country"
  label="Country"
  options={[
    { value: "", label: "Select a country" },
    { value: "usa", label: "USA" },
    { value: "can", label: "Canada" },
  ]}
/>

<!-- Checkbox -->
<Input
  as="checkbox"
  id="agree"
  name="agree"
  label="I agree to the terms"
  required
/>

<!-- Radio Group -->
<Input
  as="radio"
  id="plan"
  name="plan"
  label="Choose a plan"
  options={[
    { value: "basic", label: "Basic" },
    { value: "pro", label: "Pro" },
  ]}
/>
````

---

## Variants

```js
<Input label="Default" placeholder="Default" variant="default" />
<Input label="Dark" placeholder="Dark" variant="dark" />
<Input label="Transparent Light" placeholder="Light" variant="transparent-light" />
<Input label="Transparent Dark" placeholder="Dark" variant="transparent-dark" />
```

---

## Sizes

```js
<Input label="Extra Small" size="xs" placeholder="XS" />
<Input label="Small" size="sm" placeholder="SM" />
<Input label="Base (default)" size="base" placeholder="Base" />
<Input label="Medium" size="md" placeholder="MD" />
<Input label="Large" size="lg" placeholder="LG" />
```

*Note: Checkbox and radio sizes also respond to the `size` prop.*

---

## States

```js
<Input label="Required" placeholder="Required input" required />
<Input label="Disabled" placeholder="Disabled input" disabled />
<Input label="Read-only" value="Read-only text" readonly />
<Input label="With Error" placeholder="Error" error="Something went wrong" />
```

---

## Forms

```js
<form>
  <Input label="Email" name="email" type="email" required />
  <Input as="textarea" label="Message" name="message" rows="5" required />
  <Input as="checkbox" label="Subscribe to newsletter" name="subscribe" />
  <button type="submit">Send</button>
</form>
```

---
