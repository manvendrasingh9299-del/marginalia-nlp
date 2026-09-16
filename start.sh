#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# --- Start backend ---
cd "$SCRIPT_DIR/backend"

if [ ! -d ".venv" ]; then
  echo "Error: backend/.venv not found. Run the backend setup steps first."
  exit 1
fi

source .venv/bin/activate
echo "Starting backend on http://localhost:8000 ..."
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Kill backend automatically when this script exits (Ctrl+C included)
trap "echo ''; echo 'Stopping backend...'; kill $BACKEND_PID 2>/dev/null" EXIT

# Give the backend a moment to boot before starting the frontend
sleep 2

# --- Start frontend ---
cd "$SCRIPT_DIR/frontend"
echo "Starting frontend on http://localhost:5173 ..."
npm run dev