#!/bin/bash

node tools/scripts/update-versions.js $1

nx run electron-dapp:build
