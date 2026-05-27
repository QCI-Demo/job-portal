#!/bin/sh
set -eu

HTML_DIR="/usr/share/nginx/html"
ENV_FILE="${HTML_DIR}/env-config.js"

# Runtime environment variables (override at `docker run` with -e)
VITE_API_BASE_URL="${VITE_API_BASE_URL:-http://localhost:8080}"
VITE_APP_TITLE="${VITE_APP_TITLE:-Job Portal}"

# Escape backslashes and double quotes for safe JSON string values
escape_json() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

api_url="$(escape_json "$VITE_API_BASE_URL")"
app_title="$(escape_json "$VITE_APP_TITLE")"

cat > "$ENV_FILE" <<EOF
window.__ENV__ = {
  "VITE_API_BASE_URL": "${api_url}",
  "VITE_APP_TITLE": "${app_title}"
};
EOF
