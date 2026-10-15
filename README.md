<div align="center">

# API SQLite - Biblioteca

[![Node.js](https://img.shields.io/badge/Node.js-18+-3c873a?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4-black?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org)

API REST para gestión de una biblioteca, construida con Express, TypeScript y SQLite.

[Features](#features) • [Getting started](#getting-started) • [API](#api) • [Database](#database) • [Project structure](#project-structure)

</div>

## Overview

**API SQLite** es una API REST simple para administrar el catálogo de una biblioteca: libros y autores, almacenados en una base de datos [SQLite](https://www.sqlite.org) embebida (`biblioteca.db`). Está escrita en [TypeScript](https://www.typescriptlang.org) sobre [Express](https://expressjs.com), con soporte CORS habilitado y despliegue en un solo proceso sin configuración externa.

## Features

- **CRUD completo de libros** — crear, leer, actualizar y eliminar libros del catálogo.
- **Consulta combinada** — listado de libros con los datos de su autor mediante un `INNER JOIN`.
- **SQLite embebida** — cero configuración de servidor de base de datos; el archivo `biblioteca.db` se crea/usa localmente.
- **TypeScript estricto** — tipado completo con `strict: true` y compilación a `dist/`.
- **CORS habilitado** — lista para ser consumida desde cualquier frontend.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 o superior
- npm

### Installation

```bash
git clone https://github.com/JhoamSebastianMunoz/apiSqlite.git
cd apiSqlite
npm install
```

### Run

Compila el proyecto y arranca el servidor:

```bash
npx tsc
node dist/app.js
```

El servidor queda disponible en el puerto `10104` (o en el que definas con la variable de entorno `PORT`):

```bash
PORT=3000 node dist/app.js
```

> [!TIP]
> Para desarrollo con recarga automática puedes usar `tsx` sin cambiar el código:
> ```bash
> npx tsx app.ts
> ```

> [!NOTE]
> La base de datos `biblioteca.db` viaja junto al proyecto con datos de ejemplo (autores como Gabriel García Márquez, Edgar Allan Poe y Milan Kundera). Puedes reemplazarla por la tuya manteniendo el mismo esquema.

## Configuration

| Variable | Default | Descripción |
| --- | --- | --- |
| `PORT` | `10104` | Puerto HTTP del servidor |

## API

Todas las rutas responden JSON. La base URL por defecto es `http://localhost:10104`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/biblioteca/libros-autores` | Lista todos los libros con los datos de su autor |
| `GET` | `/biblioteca/libros?id_libro=<id>` | Obtiene un libro por su ID |
| `POST` | `/biblioteca/agregar-Libro` | Agrega un nuevo libro |
| `PUT` | `/biblioteca/actualizar-Libro/:id_libro` | Actualiza un libro existente |
| `DELETE` | `/biblioteca/eliminar-Libro?id_libro=<id>` | Elimina un libro |

### Examples

**Listar libros con autores**

```bash
curl http://localhost:10104/biblioteca/libros-autores
```

**Obtener un libro**

```bash
curl "http://localhost:10104/biblioteca/libros?id_libro=1"
```

**Agregar un libro**

```bash
curl -X POST http://localhost:10104/biblioteca/agregar-Libro \
  -H "Content-Type: application/json" \
  -d '{"nombre_libro":"Cien años de soledad","categoria":"Novela","id_autor":1}'
```

**Actualizar un libro**

```bash
curl -X PUT http://localhost:10104/biblioteca/actualizar-Libro/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre_libro":"La mala hora","categoria":"Novela","id_autor":1}'
```

**Eliminar un libro**

> [!IMPORTANT]
> El endpoint de eliminación requiere el encabezado `Authorization` con la **categoría** del libro, además del query param `id_libro`. Solo se elimina si coinciden ambos valores.

```bash
curl -X DELETE "http://localhost:10104/biblioteca/eliminar-Libro?id_libro=5" \
  -H "Authorization: Poema"
```

## Database

El esquema de `biblioteca.db` contiene dos tablas:

```text
autores                          libros
+-----------+-----------------+  +-----------+--------------+-----------+----------+
| id_autor  | nombre_autor    |  | id_Libro  | nombre_libro | categoria | id_autor |
| ciudad_origen                |  |           |              |           |          |
+-----------+-----------------+  +-----------+--------------+-----------+----------+
     (PK, autoincrement)             (PK, autoincrement)              (FK → autores.id_autor)
```

```sql
CREATE TABLE autores (
  id_autor      INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_autor  TEXT,
  ciudad_origen TEXT
);

CREATE TABLE libros (
  id_Libro     INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_libro TEXT,
  categoria    TEXT,
  id_autor     INTEGER REFERENCES autores(id_autor)
);
```

## Project structure

```text
.
├── app.ts            # Entrada de la API: rutas, middleware y arranque
├── biblioteca.db     # Base de datos SQLite con datos de ejemplo
├── tsconfig.json     # Configuración de TypeScript (strict, CommonJS → dist/)
└── package.json
```

## Tech stack

- [TypeScript](https://www.typescriptlang.org) — lenguaje y compilación
- [Express](https://expressjs.com) — framework web
- [sqlite3](https://github.com/TryGhost/node-sqlite3) — driver nativo de SQLite
- [cors](https://github.com/expressjs/cors) — middleware CORS
- [dotenv](https://github.com/motdotla/dotenv) — variables de entorno

## Troubleshooting

- **`SQLITE_ERROR: no such table`** — asegúrate de ejecutar el servidor desde la raíz del proyecto, donde se encuentra `biblioteca.db`.
- **Puerto en uso** — define otro puerto: `PORT=3000 node dist/app.js`.
- **Errores de tipos en tiempo de compilación** — ejecuta `npx tsc` y revisa la salida; el proyecto usa `strict: true`.
