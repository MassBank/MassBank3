#!/bin/bash

echo "MB3_API_URL=$1" > .env
echo "MB3_FRONTEND_URL=$2" >> .env
echo "MB3_FRONTEND_BASE_URL=$3" >> .env
echo "MB3_VERSION=${4:-"3.0.0"}" >> .env
echo "EXPORT_SERVICE_URL=$5" >> .env
echo "GOOGLE_SEARCH_CONSOLE_KEY=${6:-""}" >> .env
echo "MB3_API_URL_INTERNAL=$7" >> .env
echo "EXPORT_SERVICE_URL_INTERNAL=$8" >> .env
echo "DISTRIBUTOR_TEXT=${9:-"This website is hosted and distributed by ..."}" >> .env
echo "DISTRIBUTOR_URL=${10:-""}" >> .env
echo "MB3_FRONTEND_BROWSER_TAB_TITLE=${11:-"Massbank3"}" >> .env
echo "MB3_FRONTEND_HOMEPAGE_INTRO_TEXT=${12:-"Welcome to MassBank, an open-source mass spectral library for the identification of small chemical molecules of metabolomics, exposomics and environmental relevance."}" >> .env
echo "MB3_FRONTEND_HOMEPAGE_NEWS_SECTION_TEXT=${13:-""}" >> .env
echo "MB3_FRONTEND_HOMEPAGE_FUNDING_SECTION_TEXT=${14:-""}" >> .env
echo "MB3_FRONTEND_HOMEPAGE_ADDITIONAL_SECTION_NAME=${15:-""}" >> .env
echo "HTML_HEAD_FILE=${16:-""}" >> .env
echo "HTML_BODY_FILE=${17:-""}" >> .env


npm run start