#!/bin/bash

version=$(head -n 1 version.txt)
git commit --allow-empty -m "chore: release $version" -m "release-as: $version"

# Push the changes to the remote repository
git push origin main