# Presentacion MakosTech

## Diapositiva 1: Portada

**MakosTech**

Tienda web de tecnologia premium con catalogo, carrito, favoritos, autenticacion, panel administrativo y gestion comercial.

Presentado por: Juan Jose

## Diapositiva 2: Problema

Muchas tiendas tecnologicas muestran productos, pero no integran en una sola experiencia:

- Catalogo organizado por categorias.
- Carrito y lista de favoritos.
- Panel administrativo.
- Contacto comercial.
- Gestion simple de productos.

MakosTech resuelve esto con una plataforma web moderna y escalable.

## Diapositiva 3: Objetivo Del Proyecto

Construir una aplicacion web tipo ecommerce para productos tecnologicos, con:

- Interfaz atractiva y responsive.
- Productos, ofertas y detalle de producto.
- Carrito de compras y favoritos.
- Autenticacion con Supabase.
- Dashboard administrativo.
- Gestion de planes, proveedores y competidores.
- Interfaz para crear productos desde la tienda.

## Diapositiva 4: Tecnologias Usadas

- **React 18** para componentes de interfaz.
- **TypeScript** para tipado y mayor seguridad.
- **Vite** para desarrollo rapido y build optimizado.
- **Tailwind CSS** para estilos responsive.
- **Framer Motion** para animaciones.
- **Zustand** para estado global de carrito, favoritos y auth.
- **Supabase** como backend, autenticacion y base de datos.
- **PostgreSQL / RLS** para seguridad de datos.

## Diapositiva 5: Arquitectura General

La app esta organizada por capas:

- `src/app/routes`: paginas principales.
- `src/components`: componentes reutilizables.
- `src/hooks`: logica de carga de datos.
- `src/store`: estado global.
- `src/lib`: cliente Supabase y catalogo local.
- `src/constants`: datos constantes y respaldo local.
- `supabase/migrations`: estructura SQL de la base de datos.

Esto permite separar interfaz, datos, estado y configuracion.

## Diapositiva 6: Funcionalidades Ecommerce

MakosTech incluye:

- Pagina principal con hero, beneficios y productos destacados.
- Catalogo de productos con busqueda y filtro por categoria.
- Pagina de ofertas con contador.
- Detalle de producto con galeria, stock, garantia y envio.
- Carrito lateral con cantidades y total.
- Lista de favoritos.
- Formulario de contacto.
- Gestion local de productos para demo y administracion rapida.
- Red logistica con arbol de catalogo y grafo de operacion.

## Diapositiva 7: Productos Quemados Para La Demo

Se agrego un catalogo local para que la aplicacion funcione aunque Supabase no responda.

Productos incluidos:

- MacBook Pro 14 M3 Pro.
- ASUS ROG Strix G16.
- iPhone 15 Pro.
- Samsung Galaxy S24 Ultra.
- Sony WH-1000XM5.
- LG UltraWide 34.
- Logitech MX Master 3S.
- Keychron K8 Pro.
- PlayStation 5 Slim.
- iPad Air M2.
- AirPods Pro 2.
- Samsung Odyssey G5.

Esto garantiza que la entrega se pueda presentar sin depender de internet o DNS de Supabase.

## Diapositiva 8: Gestion De Productos

MakosTech incluye una interfaz en `/gestionar-productos` para:

- Crear productos.
- Editar productos locales.
- Eliminar productos locales.
- Cargar imagen por URL.
- Definir precio, categoria, stock y descripcion.
- Ver una vista previa antes de guardar.

Los productos se guardan en el navegador y aparecen inmediatamente en el catalogo.

## Diapositiva 9: Arboles Y Grafos En El Proyecto

MakosTech incluye una seccion en `/red-logistica` para evidenciar estructuras de datos aplicadas al negocio:

- **Arbol:** representa la jerarquia `Catalogo -> Categorias -> Productos`.
- **Grafo:** representa el flujo `Proveedor -> Bodega -> MakosTech -> Envio -> Cliente`.
- **Lista de adyacencia:** guarda las conexiones entre nodos del grafo.
- **Recorrido BFS:** muestra el orden de visita de la red logistica.

Codigo de evidencia:

```ts
type TreeNode = {
  id: string;
  label: string;
  children: TreeNode[];
};

function buildAdjacencyList(nodes: GraphNode[], edges: GraphEdge[]) {
  const list: Record<string, string[]> = {};
  nodes.forEach((node) => {
    list[node.id] = [];
  });
  edges.forEach((edge) => {
    list[edge.from].push(edge.to);
  });
  return list;
}

async function runTraversal() {
  const queue = ['supplier'];
  const seen = new Set<string>();
  const order: string[] = [];

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node || seen.has(node)) continue;
    seen.add(node);
    order.push(node);
    adjacencyList[node].forEach((neighbor) => {
      if (!seen.has(neighbor)) queue.push(neighbor);
    });
  }
}
```

Guion:

Esta diapositiva muestra evidencia tecnica de estructuras de datos dentro del proyecto. El arbol se usa para organizar el catalogo por niveles, y el grafo se usa para representar relaciones entre proveedor, bodega, tienda, envio y cliente.

## Diapositiva 10: Backend Y Base De Datos

El proyecto incluye migraciones para Supabase:

- `profiles`: perfiles de usuarios.
- `categories`: categorias del catalogo.
- `products`: productos.
- `orders`: ordenes.
- `order_items`: productos dentro de ordenes.
- `wishlist`: favoritos.
- `contact_messages`: mensajes de contacto.
- `competitors`: competidores comerciales.
- `providers`: proveedores.
- `plans`: planes de suscripcion.
- `subscriptions`: suscripciones.

La base usa Row Level Security para controlar accesos.

## Diapositiva 11: Dashboard Administrativo

El dashboard permite revisar:

- Estadisticas de productos, pedidos, usuarios y ventas.
- Accesos a gestion comercial.
- Competidores.
- Proveedores.
- Planes de suscripcion.

Tambien se prepararon paginas CRUD para competidores, proveedores y planes.

## Diapositiva 12: Seguridad

La seguridad esta planteada con:

- Variables de entorno para credenciales.
- Autenticacion de Supabase.
- Politicas RLS por tabla.
- Usuarios con rol `admin` y `user`.
- Validacion de acceso a datos propios.

Ejemplo: un usuario solo puede leer sus pedidos y favoritos, mientras un admin puede gestionar el catalogo.

## Diapositiva 13: Problema Detectado Y Solucion

Durante la revision se detecto que Supabase no resolvia el dominio configurado:

`zftfzfzssazzsvcnyyya.supabase.co`

Eso causaba que la pagina de productos se quedara mostrando skeleton loaders.

Solucion aplicada:

- Se agrego manejo de errores con `try/catch/finally`.
- Se agrego catalogo local de respaldo.
- Se agrego gestion local de productos.
- Ahora la tienda muestra productos aunque falle Supabase.

## Diapositiva 14: Validacion Tecnica

Se ejecutaron pruebas de calidad:

- `npm run typecheck`: correcto.
- `npm run lint`: correcto.
- `npm run build`: correcto.

La aplicacion compila para produccion.

## Diapositiva 15: Conclusiones

MakosTech es una aplicacion ecommerce completa, con enfoque comercial.

Logros principales:

- Interfaz moderna y responsive.
- Catalogo funcional.
- Carrito y favoritos.
- Gestion local de productos.
- Red logistica con arboles y grafos.
- Dashboard administrativo.
- Backend preparado con Supabase.
- Productos locales para asegurar la demo.

## Guion Corto Para Exponer

Buenos dias. Mi proyecto se llama MakosTech y es una tienda web de tecnologia premium. El objetivo fue crear una plataforma ecommerce moderna donde el usuario pueda explorar productos, buscar por categoria, ver ofertas, agregar al carrito y guardar favoritos.

La aplicacion esta construida con React, TypeScript, Vite, Tailwind y Supabase. En la parte de frontend se organizaron rutas, componentes reutilizables, hooks y stores globales. En la parte de backend se prepararon migraciones de base de datos con productos, usuarios, pedidos, favoritos, mensajes, proveedores, competidores, planes y suscripciones.

Durante la revision se detecto que el dominio de Supabase configurado no resolvia, por eso los productos no aparecian. Para asegurar la entrega se agrego un catalogo local de respaldo y una interfaz para crear productos desde la tienda.

En conclusion, MakosTech integra una tienda funcional, administracion comercial y una base preparada para seguir escalando como negocio digital.
