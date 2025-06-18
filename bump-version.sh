#!/bin/bash

NEW_VERSION=$1

if [ -z "$NEW_VERSION" ]; then
  echo "Please provide a version. Usage: ./bump-version.sh v1.2.3"
  exit 1
fi

# Set version in go.mod
sed -i "s/^module .*/module github.com\/MassBank\/MassBank3\/$NEW_VERSION/" go.mod

echo "Set version in go.mod to auf $NEW_VERSION:."