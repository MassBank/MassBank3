#!/bin/bash

echo "MB3_API_URL=$1" > .env
echo "MB3_FRONTEND_URL=$2" >> .env
echo "MB3_FRONTEND_BASE_URL=$3" >> .env
echo "EXPORT_SERVICE_URL=$4" >> .env
echo "MB3_API_URL_INTERNAL=$5" >> .env
echo "EXPORT_SERVICE_URL_INTERNAL=$6" >> .env
echo "DISTRIBUTOR_TEXT=${7:-"This website is hosted and distributed by ..."}" >> .env
echo "DISTRIBUTOR_URL=${8:-""}" >> .env
echo "MB3_FRONTEND_BROWSER_TAB_TITLE=${9:-"Massbank3"}" >> .env
echo "MB3_FRONTEND_HOMEPAGE_INTRO_TEXT=${10:-"Welcome to MassBank, an open-source mass spectral library for the identification of small chemical molecules of metabolomics, exposomics and environmental relevance."}" >> .env
echo "MB3_FRONTEND_HOMEPAGE_NEWS_SECTION_TEXT=${11:-""}" >> .env
echo "MB3_FRONTEND_HOMEPAGE_FUNDING_SECTION_TEXT=${12:-""}" >> .env
echo "MB3_FRONTEND_HOMEPAGE_ADDITIONAL_SECTION_NAME=${13:-""}" >> .env
echo "HTML_HEAD_FILE=${14:-""}" >> .env
echo "HTML_BODY_FILE=${15:-""}" >> .env


npm run start