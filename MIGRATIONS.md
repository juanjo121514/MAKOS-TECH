# Migraciones - MakosTech

Este repositorio incluye migraciones SQL en `supabase/migrations/`.

Aplicar una migración localmente (recomendado):

1. Exporta la URL de conexión a la base de datos (Postgres) de tu proyecto Supabase:

```bash
export SUPABASE_DB_URL="postgres://postgres:password@db.xxxxxx.supabase.co:5432/postgres"
```

2. Instala la dependencia `pg` si no está instalada:

```bash
npm install pg
```

3. Ejecuta el script para aplicar la migración específica:

```bash
npm run apply:migrations
```

Alternativa: pegar el SQL en el SQL Editor del panel de Supabase (app.supabase.io -> SQL Editor).

Nota de seguridad: Mantén las credenciales (`SUPABASE_DB_URL` o `SERVICE_ROLE`) fuera de repositorios públicos.
 
 Nueva migración incluida:
 
 - `supabase/migrations/20260526130000_003_plans_subscriptions.sql` — crea las tablas `plans` y `subscriptions` y agrega dos planes por defecto (Plan Estándar y Plan Premium).
 
 Para aplicar SOLO esa migración con el script, ejecuta:
 
 ```bash
 node ./scripts/apply_migration.js supabase/migrations/20260526130000_003_plans_subscriptions.sql
 ```
 
 O usando la variable de entorno y el comando npm:
 
 ```bash
 export SUPABASE_DB_URL="postgres://..."
 npm run apply:migrations
 ```
