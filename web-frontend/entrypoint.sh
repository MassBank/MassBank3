#!/bin/bash

echo "MB3_API_URL=$1" > .env
echo "MB3_FRONTEND_URL=$2" >> .env
echo "MB3_BASE_URL=$3" >> .env
echo "MB3_VERSION=$4" >> .env
echo "EXPORT_SERVICE_URL=$5" >> .env
echo "GOOGLE_SEARCH_CONSOLE_KEY=$6" >> .env
echo "MB3_API_URL_INTERNAL=$7" >> .env
echo "EXPORT_SERVICE_URL_INTERNAL=$8" >> .env
echo "DISTRIBUTOR_TEXT=$9" >> .env
echo "DISTRIBUTOR_URL=$10" >> .env
echo "MB3_FRONTEND_BROWSER_TAB_TITLE=$11" >> .env
echo "MB3_FRONTEND_HOMEPAGE_INTRO_TEXT=$12" >> .env

npm run start