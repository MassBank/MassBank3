#!/bin/bash

version=$(head -n 1 version.txt)
git commit --allow-empty -m "chore: release $version" -m "release-as: $version"

# Push the changes to the main branch (remote)
git checkout main 
git merge dev
git push origin main

# Switch back to the development branch
git checkout dev