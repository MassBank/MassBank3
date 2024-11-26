#!/bin/bash

echo "VITE_MB3_API_URL=$1" > .env
echo "VITE_MB3_FRONTEND_URL=$2" >> .env
echo "VITE_MB3_BASE_URL=$3" >> .env
echo "VITE_MB3_VERSION=$4" >> .env

npm run start