# Osraty API

A REST API for the **Osraty** charity / donation platform, connecting donors
(funders) with beneficiaries and managing donation payments, benefit requests,
community news & events, notifications and reporting.

Built with **Node.js**, **Fastify**, **MongoDB (Mongoose)** and **Swagger**.

## Features

- **Three actor types** — `user`, `admin` and `superAdmin`, each with its own
  collection, controller and authentication flow.
- **JWT authentication** via a custom `token` request header.
- **Donations & requests** — one-time, monthly and yearly payment types, plus
  beneficiary benefit requests with an approval workflow.
- **News & events** — articles, comments and event attendance.
- **Notifications** — persisted notifications with optional FCM push, plus
  scheduled monthly/yearly payment reminder jobs (`node-cron`).
- **Reporting & analytics** — funder/beneficiary reports (incl. Excel export)
  and per-year aggregation endpoints.
- **File uploads** handled through Cloudinary.
- **Swagger** documentation served at `/documentation`.

## Requirements

- Node.js (`10.16.3`)
- MongoDB
- npm (`6.9.0`)

## Installation

```bash
# install dependencies
npm install

# start the server with hot reload (nodemon)
npm start
```

The server listens on `process.env.PORT` or `3000`.

## Configuration

Configuration is handled by the [`config`](https://www.npmjs.com/package/config)
package under `config/`.

- `jwtPrivateKey` is supplied via the `osraty_jwtPrivateKey` environment variable
  (see `config/custom-environment-variables.json`). Set it before starting the
  server so JWT signing/verification works.

## Project structure

```
index.js               App bootstrap: Fastify, plugins, DB, routes, cron jobs
routes/index.js        Single flat array of all /api routes
controllers/           Request handlers and business logic
models/                Mongoose schemas
utils/                 Helpers (password hashing, enums)
config/                Config + Swagger options
uploads/               Uploaded files
```

## Architecture

Requests flow through a deliberately flat pipeline:

```
index.js → routes/index.js → controllers/* → models/* (Mongoose)
```

- **Authentication** uses a custom `token` header (not `Authorization: Bearer`).
  Protected routes declare `beforeHandler: [auth.getToken]`.
- **Responses** are plain objects shaped as `{ status_code, status, message, ... }`
  sent with `reply.send(...)`. User-facing messages are in Arabic.
- **Passwords** are hashed with MD5 via `utils/utils.js`.

## API documentation

With the server running, open:

```
http://localhost:3000/documentation
```

## License

ISC
