#!/bin/bash
echo ""
echo "  Starting HORA..."
echo ""

# Check if Python 3 is installed
if ! command -v python3 &>/dev/null && ! command -v python &>/dev/null; then
    echo "  Python is not installed on this computer."
    echo ""
    echo "  Install it with:"
    echo "    macOS:  brew install python   (or download from https://python.org)"
    echo "    Linux:  sudo apt install python3"
    echo ""
    exit 1
fi

# Use python3 if available, otherwise fall back to python
PYTHON=$(command -v python3 || command -v python)

# Run from the directory of this script
cd "$(dirname "$0")"
"$PYTHON" start.py
