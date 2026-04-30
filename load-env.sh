#!/bin/bash

find_env() {
  local dir="$PWD"
  while [ "$dir" != "/" ]; do
    if [ -f "$dir/.env" ]; then
      echo "$dir/.env"
      return
    fi
    dir="$(dirname "$dir")"
  done
}

env_file=$(find_env)

if [ -n "$env_file" ]; then
  while IFS='=' read -r key value; do
    # skip empty lines and comments
    [[ -z "$key" || "$key" == \#* ]] && continue
    export "$key=$value"
  done < "$env_file"
  echo "✓ Loaded .env from: $env_file"
else
  echo "✗ No .env found in any parent directory"
fi