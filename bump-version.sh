#!/bin/bash

NEW_VERSION=$1

if [ -z "$NEW_VERSION" ]; then
  echo "Please provide a version. Usage: ./bump-version.sh v1.2.3"
  exit 1
fi

echo $NEW_VERSION > version.txt
echo $NEW_VERSION > web-frontend/version.txt

echo "Set version in version.txt and web-frontend/version.txt to $NEW_VERSION."