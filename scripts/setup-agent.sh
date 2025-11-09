#!/bin/bash

# Navigate to the agent directory
cd "agent" || exit 1
echo "$(dirname "$0")/agent"
# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
  python3 -m venv .venv || python -m venv .venv
fi

# Activate the virtual environment
source .venv/bin/activate

if ! command -v poetry >/dev/null 2>&1; then
  echo "Poetry is not installed. Skipping agent dependencies setup."
  exit 0
fi

(poetry install --no-root)