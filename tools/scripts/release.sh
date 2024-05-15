#!/bin/bash

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

export GIT_SSH_COMMAND='ssh -i ~/.ssh/id_ed25519'

npx semantic-release --no-ci
