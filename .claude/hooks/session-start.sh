#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/home/user/SICT}"

# Step 1: Pull latest changes from repo
cd "$PROJECT_DIR"
git pull origin master --ff-only 2>/dev/null || true
echo "Repo synced to latest"

# Step 2: Install frontend dependencies (dashboard)
FRONTEND_DIR="$PROJECT_DIR/emergent-learning/dashboard-app/frontend"
if [ -d "$FRONTEND_DIR" ] && [ -f "$FRONTEND_DIR/package.json" ]; then
  cd "$FRONTEND_DIR"
  if command -v bun &>/dev/null; then
    bun install 2>/dev/null || npm install 2>/dev/null || true
  else
    npm install 2>/dev/null || true
  fi
  echo "Frontend dependencies installed"
fi

# Step 3: Install E2E test dependencies
TESTS_DIR="$PROJECT_DIR/emergent-learning/dashboard-app/tests"
if [ -d "$TESTS_DIR" ] && [ -f "$TESTS_DIR/package.json" ]; then
  cd "$TESTS_DIR"
  if command -v bun &>/dev/null; then
    bun install 2>/dev/null || npm install 2>/dev/null || true
  else
    npm install 2>/dev/null || true
  fi
  echo "E2E test dependencies installed"
fi

# Step 4: Install Python backend dependencies
BACKEND_DIR="$PROJECT_DIR/emergent-learning/dashboard-app/backend"
if [ -d "$BACKEND_DIR" ] && [ -f "$BACKEND_DIR/requirements.txt" ]; then
  pip install --ignore-installed -r "$BACKEND_DIR/requirements.txt" 2>/dev/null || true
  if [ -f "$BACKEND_DIR/requirements-test.txt" ]; then
    pip install -r "$BACKEND_DIR/requirements-test.txt" 2>/dev/null || true
  fi
  echo "Backend dependencies installed"
fi

# Step 5: Set up environment variables for the session
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export PYTHONPATH=\"$PROJECT_DIR/emergent-learning/dashboard-app/backend\"" >> "$CLAUDE_ENV_FILE"
fi

echo "Session startup complete — repo pulled, dependencies installed"
