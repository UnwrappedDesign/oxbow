# TO DO: Component and Blocks List

## Blocks Description on block page

La idea es poner una descripcion de los bloques en la pagina de cada bloque `[index].astro` . Igual podemos poner la descripcion en cada bloque asi y pasarle los props en la misma pagina que pasamos el numero del bloque, y debajo de estos poner lo que es la descripcion.

```html
---
description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
---
```

Y despues meterlo en esta parte de la página:

```html
<section>
  <Wrapper variant="hero">
    <button
      class="flex items-center gap-2 text-base-500 hover:text-accent-500"
      onclick="history.back();"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left size-5"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M5 12l14 0"></path>
        <path d="M5 12l6 6"></path>
        <path d="M5 12l6 -6"></path></svg
      >Go Back
    </button>
    <Text
      tag="h1"
      variant="displayMD"
      class="uppercase mt-4 font-semibold tracking-tight text-black"
    >
      {subsection.replace(/-/g, " ")}
    </Text>
    <Text
      tag="h1"
      variant="displayMD"
      class="uppercase mt-4 font-semibold tracking-tight text-black"
    >
      {subsection.description}
    </Text>
  </Wrapper>
</section>
```

## Pagination

En el documento [Section]/[Subsection]/[index].astro anadir el componente pagination para que el usuario pueda navegar para ver los siguientes y los previos bloques en esa categorie.

- Ejemplo: Heros > Puede ver desde el Hero 01 hasta el ultimo y cuando llega al ultimo y hace click en siguien que se muestre el primer, que tenga loop en vez de pararse y tener que volver.
- Razón: Esto mejoraria la UX del usuario.

El markup ya lo tienes en la pagina

````html
<div>
  <nav class="relative z-0 inline-flex gap-1.5 sr-only" aria-label="Pagination">
    <!-- Previous Page Button -->

    <IconButton
      disable
      aria-label="Go to previous page"
      variant="alternative"
      size="xs"
    >
      <ChevronLeft size="sm" slot="icon" />
      <span class="sr-only">Previous</span>
    </IconButton>

    <!-- Next Page Button -->
    <IconButton aria-label="Go to next page" variant="alternative" size="xs">
      <ChevronRight size="sm" slot="icon" />
      <span class="sr-only">Next</span>
    </IconButton>
  </nav>
</div>
``` ## Container no copiable. La idea de este `container` es que en algunos
bloques se pueda copiar el contenido de un `container` poro no el `container`. -
Razón: Esot haria que el usuario no pierda tiempo en tener que borrar bloques y
contenido que solo es necesario para mostrar el bloque que les ofrecemos. Te
explico: Digamos que tenmos el bloque de los botones que se muestran todos los
botones, lo que pasa que para que estos esten centrados, necesitan un wrapper y
para no tener que hacer todo el playground de nuevo yo habia pensado de hacer
algo así. Te lo explico a mi manera. En este caso seria solo copiar los botones
en si y que el `section` y el `div` no se copien. ```html
<!-- Comienzo del container -->
<section>
  <div class="flex flex-wrap items-end justify-center gap-4 py-12 mx-auto">
    <!-- Terminamos el container  -->
    <button variant="default" size="xs">Button Default</button>
    <button variant="default" size="sm">Button Default</button>
    <button variant="default" size="base">Button Default</button>
    <button variant="default" size="md">Button Default</button>
    <button variant="default" size="lg">Button Default</button>
    <button variant="default" size="xl">Button Default</button>
  </div>
</section>
````

Aqui tieenes otro ejemplo: Como ves, aqui no tiene sentido copiar la seccion ni el div, pir que el usuario solo necesitara copiar el avatar.

```html
<section>
  <div
    class="flex justify-center px-8 py-12 mx-auto md:px-12 lg:px-24 max-w-7xl items-center"
  >
    <img
      class="inline-block size-16 rounded-full"
      src="/avatars/1.jpg"
      alt=""
    />
  </div>
</section>
```
