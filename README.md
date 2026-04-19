# @markox/logger

A lightweight, customizable and colorized logger for Node.js.

## Features

- No environment variables required
- Fully customizable colors
- File logging support
- TypeScript first
- Callsite detection

## Installation

```bash
npm install @markox/logger
pnpm add @markox/logger
yarn add @markox/logger
```

```ts
import { createLogger } from "@markox/logger";

const logger = createLogger({
  types: {
    API: "#42a5f5",
    DB: "#4caf50",
    AUTH: "#ab47bc",
  },
  debug: true, // Set to true to get .debug() logs
  logDir: "./logs", // Route to logs folder
  logToFile: false, // Set to true to get file logs
});

logger.info("API", "Servidor iniciado");
logger.info("DB", "Conectado");
logger.info("AUTH", "hola");
logger.debug("API", "Request recibida", { endpoint: "/users" });
logger.warn("DB", "Consulta lenta detectada");
logger.error("AUTH", "Fallo de autenticación", { userId: 12345 });
```

---

> Made by Markox
