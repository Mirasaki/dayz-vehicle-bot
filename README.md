# dayz-vehicle-bot

## Overview

[![CodeFactor](https://www.codefactor.io/repository/github/mirasaki/dayz-vehicle-bot/badge)](https://www.codefactor.io/repository/github/mirasaki/dayz-vehicle-bot)
[![GitHub license](https://img.shields.io/github/license/Mirasaki/dayz-vehicle-bot?style=flat-square)](https://github.com/Mirasaki/dayz-vehicle-bot/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/Mirasaki/dayz-vehicle-bot?style=flat-square)](https://github.com/Mirasaki/dayz-vehicle-bot/issues)
[![GitHub forks](https://img.shields.io/github/forks/Mirasaki/dayz-vehicle-bot?style=flat-square)](https://github.com/Mirasaki/dayz-vehicle-bot/network)
[![GitHub stars](https://img.shields.io/github/stars/Mirasaki/dayz-vehicle-bot?style=flat-square)](https://github.com/Mirasaki/dayz-vehicle-bot/stargazers)

A DayZ bot written in JavaScript to display an overview of your in-game vehicles in Discord using a simple JSON config file.

## Features

- Search vehicles using the `/vehicles` command, auto-complete enabled.
- Automatically post all available vehicles in a configured text channel on boot, making sure the information displayed is always up-to-date.
  - ❗ The bot deletes previous messages - belonging to the client - in the channel to keep it clean, so **use a dedicated channel for this**
- Easily add `variants` that inherit data from the base vehicle, while still allowing you to overwrite any values
- Add more custom fields to the embed, like where/how to obtain the vehicle if it's not for sale.
  - Check out the last `M3S - Example` example in the `/config/vehicles.json` file for more information, or `/config/vehicles-advanced-config.json` for an advanced config example

## Technologies Used

- [discord.js-bot-template](https://github.com/Mirasaki/discord.js-bot-template)

## Live Demo

![Embed Output/Preview](https://user-images.githubusercontent.com/57721238/170555505-153181f2-989c-49fd-acea-d75acbcb1fb3.png)
[Demo Preview](https://cdn.mirasaki.dev/zRV4.mp4)

## Installation

### Requirements

- [Node/NodeJS](https://nodejs.org/en/) - Be sure to check the box that says "Automatically install the necessary tools" when you're running the installation wizard

**1)** Head over to [the download page](https://github.com/Mirasaki/dayz-vehicle-bot/releases/)

**2)** Download either the `zip` or `zip.gz` source code

**3)** Extract it using [your favorite zip tool](https://www.rarlab.com/download.htm)

**4)** Open the folder containing your recently extracted files

**5)** Open a console/terminal/shell prompt in this directory

- Run `npm install` to install all dependencies

### ALL CONFIGURATION IS DONE IN THE `/config/` FOLDER

**6)** Rename `.env.example` to `.env` located in the `/config` folder

- Provide all your configuration values in this file
  - Get a Bot Token from [the Discord developer portal](https://www.discord.com/developers)
- Also provide the values in `config/config.json` (optional)

**7)** Use `node .` to start the application or `npm run start:dev` if you have `nodemon` installed for automatic restarts on changes (development)
