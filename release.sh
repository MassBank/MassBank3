#!/bin/bash

version=$(head -n 1 mb_version.txt)
# Push the changes to the main branch (remote)
git checkout main
git pull origin main
git merge dev --no-ff -m "chore: release $version" -m "release-as: $version"
git push origin main
# Switch back to the development branch
git checkout dev
git rebase main
git push origin dev