#!/bin/bash

find_nvmrc() {
  local dir="$PWD"
  while [ "$dir" != "/" ]; do
    if [ -f "$dir/.nvmrc" ]; then
      echo "$dir/.nvmrc"
      return
    fi
    dir="$(dirname "$dir")"
  done
}

nvmrc=$(find_nvmrc)

if [ -n "$nvmrc" ]; then
  echo "✓ Found .nvmrc at: $nvmrc"
  nvm use "$(cat "$nvmrc")"
else
  echo "✗ No .nvmrc found in any parent directory"
fi