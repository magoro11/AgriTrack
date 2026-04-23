#!/usr/bin/env bash
set -euo pipefail

# Support Railway (or other hosts) whether the service root is the repo root
# (AgriTrack/ with backend/ inside) or the Django app root (backend/ checked out alone).
if [[ -f manage.py ]]; then
  :
elif [[ -f backend/manage.py ]]; then
  cd backend
else
  echo "Cannot find Django project (expected manage.py here or under backend/)." >&2
  exit 1
fi

exec gunicorn agri_backend.wsgi:application --bind "0.0.0.0:${PORT:-8000}"
