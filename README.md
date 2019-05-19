# PMGJ Project - Totally Not Street Fighter!

## Overview

Simple tug-of-war game, built with Phaser.

## Setup

### 1. Clone this repo

In your terminal, navigate into your workspace directory and run

```git clone https://github.com/sammorrow/pmgj2019.git```

### 2. Install node.js and npm:

https://nodejs.org/en/

### 3. Install dependencies (optionally you can install [yarn](https://yarnpkg.com/)):

Navigate to the cloned repo's directory and run:

```npm install``` 

### 4. Run the development server:

In the same directory, run:

```npm run dev```

This will run a server so you can run the game in a browser. It will also start a watch process, so you can change the source and the process will recompile and refresh the browser automatically.

To run the game, open your browser and enter http://localhost:3000 into the address bar.

## Build for deployment:

Run:

```npm run deploy```

This will optimize and minimize the compiled bundle.

## Deploy for cordova:

Make sure to uncomment the cordova.js file in the src/index.html and to update config.xml with your informations. (name/description...)

More informations about the cordova configuration:
https://cordova.apache.org/docs/en/latest/config_ref/

There is 3 platforms actually tested and supported : 
- browser
- ios
- android

First run (ios example):

```
npm run cordova
cordova platform add ios
cordova run ios
```

Update (ios example):

```
npm run cordova
cordova platform update ios
cordova run ios
```

This will optimize and minimize the compiled bundle.

## Config:
before you get to work you will surely want to check the config file. You could setup dimensions, webfonts, etc