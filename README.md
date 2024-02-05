# APMAL - Anime-Planet & MyAnimeList Synchronizer

APMAL is a web-based tool designed to synchronize anime lists between Anime-Planet and MyAnimeList. It uses MyAnimeList API and scrapes Anime-Planet user list to maintain an updated anime database across both platforms.

## Features

-   Synchronize anime lists between Anime-Planet and MyAnimeList.
-   User-friendly interface for easy navigation and sync management.

## Installation

1. Clone the repository: `git clone https://github.com/DavidmLopes/APMAL`
2. Create .env file with the following variables:
    - MAL_CLIENT_ID: Id of your MyAnimeList API
    - MAL_CLIENT_SECRET: Secret key of your MyAnimeList API
    - DATABASE_URL: Url of your mongodb database.
3. Install dependencies: `npm install`
4. Start the server: `npm run dev`
5. Open `http://localhost:3000` in a web browser.

## Usage

1. Log in using your MyAnimeList credentials.
2. Provide your Anime Planet username.
3. Choose the synchronization options and start the sync process.

## Documentation

MyAnimeList API docs: https://myanimelist.net/apiconfig/references/api/v2
