# MassBank3 development container

The container provides the toolchain for both parts of MassBank3:

- Go 1.23.8, `gopls`, Delve, `gofumpt` and Staticcheck
- Node.js 23 and npm for `web-frontend`
- Maven, curl, jq and the usual build utilities required by API generation
- VS Code extensions for Go, TypeScript/ESLint, Prettier and Docker

After the container is created, `.devcontainer/post-create.sh` downloads the Go
modules and runs `npm ci` in `web-frontend`.

## Common commands

Inside the container:

```bash
go test ./...
go build ./...
npm --prefix web-frontend run dev
npm --prefix web-frontend run compile
npm --prefix web-frontend run eslint
bash generate_api_server.sh
```

The forwarded ports are 3000 (frontend), 8080/8081 (API), 5432 (PostgreSQL)
and 40000 (Delve). The frontend dev server should listen on `0.0.0.0` when it
is accessed through the forwarded port.

## Running without an IDE

`.devcontainer/run.sh` builds the image on demand and starts a disposable
interactive container using Podman or Docker:

```bash
./.devcontainer/run.sh
./.devcontainer/run.sh go test ./...
./.devcontainer/run.sh npm --prefix web-frontend run compile
./.devcontainer/run.sh --build
```
