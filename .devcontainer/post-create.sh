#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "Downloading Go modules..."
go mod download

echo "Installing web-frontend dependencies..."
npm ci --prefix web-frontend

echo "MassBank3 development dependencies are ready."
