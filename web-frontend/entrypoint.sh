#!/bin/bash

touch .env
echo "VITE_MB3_API_URL=$1" > .env
echo "VITE_MB3_FRONTEND_URL=$2" >> .env
echo "VITE_MB3_BASE_URL=$3" >> .env

npm run start