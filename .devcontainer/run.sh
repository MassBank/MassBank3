#!/usr/bin/env bash
set -euo pipefail

# Script to build and run the MassBank3 development container with Podman or Docker.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
IMAGE_NAME="massbank3-dev"

CONTAINER_TOOL=""
if command -v podman >/dev/null 2>&1; then
  CONTAINER_TOOL="podman"
elif command -v docker >/dev/null 2>&1; then
  CONTAINER_TOOL="docker"
else
  echo "Error: Neither podman nor docker was found in PATH." >&2
  exit 1
fi

build_image() {
  echo "Building devcontainer image '${IMAGE_NAME}' with ${CONTAINER_TOOL}..."
  "${CONTAINER_TOOL}" build \
    -t "${IMAGE_NAME}" \
    -f "${SCRIPT_DIR}/Dockerfile" \
    "${SCRIPT_DIR}"
}

print_help() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS] [COMMAND...]

Run commands or an interactive shell inside the MassBank3 development container.

Options:
  --build       Force rebuild of the devcontainer image
  -h, --help    Show this help message

Examples:
  $(basename "$0")                        # Open interactive bash shell in container
  $(basename "$0") go test ./...
  $(basename "$0") npm --prefix web-frontend run compile
  $(basename "$0") --build                # Rebuild image before running
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  print_help
  exit 0
fi

if [[ "${1:-}" == "--build" ]]; then
  build_image
  shift
fi

# Build image if it doesn't exist yet
if ! "${CONTAINER_TOOL}" image exists "${IMAGE_NAME}" 2>/dev/null; then
  build_image
fi

EXTRA_ARGS=()
if [[ "${CONTAINER_TOOL}" == "podman" ]]; then
  EXTRA_ARGS+=(
    "--userns=keep-id:uid=1000,gid=1000"
    "--security-opt" "label=disable"
  )
fi

# Interactive TTY allocation if stdin is a terminal
INTERACTIVE_FLAGS=()
if [ -t 0 ]; then
  INTERACTIVE_FLAGS+=("-it")
else
  INTERACTIVE_FLAGS+=("-i")
fi

if [ $# -eq 0 ]; then
  # Default: open bash shell
  exec "${CONTAINER_TOOL}" run "${INTERACTIVE_FLAGS[@]}" --rm \
    "${EXTRA_ARGS[@]}" \
    -v "${WORKSPACE_ROOT}:/workspaces/MassBank3:Z" \
    -w /workspaces/MassBank3 \
    "${IMAGE_NAME}" \
    bash
else
  # Execute provided command
  exec "${CONTAINER_TOOL}" run "${INTERACTIVE_FLAGS[@]}" --rm \
    "${EXTRA_ARGS[@]}" \
    -v "${WORKSPACE_ROOT}:/workspaces/MassBank3:Z" \
    -w /workspaces/MassBank3 \
    "${IMAGE_NAME}" \
    "$@"
fi
