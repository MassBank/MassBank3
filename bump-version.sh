#!/bin/bash

NEW_VERSION=$1

if [ -z "$NEW_VERSION" ]; then
  echo "Please provide a version. Usage: ./bump-version.sh v1.2.3"
  exit 1
fi

echo $NEW_VERSION > version.txt
echo $NEW_VERSION > web-frontend/version.txt
sed "s/^version.*/version: $NEW_VERSION/g" CITATION.cff > CITATION2.cff
mv CITATION2.cff CITATION.cff
sed "s/^date-released.*/date-released: $(date +%Y-%m-%d)/g" CITATION.cff > CITATION2.cff
mv CITATION2.cff CITATION.cff

echo "Set version in version.txt, web-frontend/version.txt, and CITATION.cff to $NEW_VERSION."

# Add the version files to git and commit the changes
git add version.txt
git add web-frontend/version.txt
git add CITATION.cff
git commit -m "chore: increase version to $NEW_VERSION"