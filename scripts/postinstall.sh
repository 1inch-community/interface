#!/usr/bin/env bash

nx run models:build
pnpm link ./dist/libs/models
nx run ui-components:build
pnpm link ./dist/libs/ui-components
nx run sdk:build
pnpm link ./dist/libs/sdk
nx run widgets:build
pnpm link ./dist/libs/widgets