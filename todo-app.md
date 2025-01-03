# TO DO: Component and Blocks List

## Pagination

En el documento [Subsection].astro anadir el componente pagination para que el usuario pueda navegar para ver los siguientes y los previos bloques en esa categorie.
Ejemplo: Heros > Puede ver desde el Hero 01 hasta el ultimo y cuando llega al ultimo y hace click en siguien que se muestre el primer, que tengo loop en ve de pararse y tener que volver.

## Container no copiable.

La idea de este `container` es que en algunos bloques se pueda copiar el contenido de un `container` poro no el `container`.
Te explico: Digamos que tenmos el bloque de los botones que se muestran todos los botones, lo que pasa que para que estos esten centrados, necesitan un wrapper y para no tener que hacer todo el playground de nuevo yo habia pensado de hacer algo así. Te lo explico a mi manera.

En este caso seria solo copiar los botones en si y que el `section` y el `div` no se copien.

```html
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
```

Aqui tieenes otro ejemplo: Como ves, aqui no tiene sentido copiar la seccion ni el div, pir que el usuario solo necesitara copiar el avatar.
```html
<section>
  <div class="flex justify-center px-8 py-12 mx-auto md:px-12 lg:px-24 max-w-7xl items-center">
    <img
      class="inline-block size-16 rounded-full"
      src="/avatars/1.jpg"
      alt=""
    />
  </div>
</section>

```
