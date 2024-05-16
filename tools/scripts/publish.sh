#!/bin/bash

node tools/scripts/update-versions.js $1

rm -rf apps/electron-dapp/out
rm -rf apps/electron-dapp/dist
nx run electron-dapp:build
