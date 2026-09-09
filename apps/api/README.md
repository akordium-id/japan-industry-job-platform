# API

## Development

```bash
pnpm dev
```

## Session Store

This app uses `express-mysql-session`. Before running in production, create the sessions table in MySQL:

```bash
mysql -u <user> -p <database> < node_modules/express-mysql-session/lib/schema.sql
```

In development, the session store is configured with `createDatabaseTable: true` so the table is created automatically.

## Documentation

- Swagger UI: `GET /api/docs`
- JSON spec: `GET /api/docs.json`

## Logging

This app uses `pino` for structured logging. In production, logs are emitted as JSON. In development, logs are still output as JSON to stdout.
