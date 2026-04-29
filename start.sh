#!/usr/bin/env bash
set -euo pipefail

# Support Railway whether the service root is the repo root
# (AgriTrack/ with backend/ inside) or the Django app root itself.
if [[ -f backend/manage.py && -d backend/agri_backend ]]; then
  cd backend
elif [[ -f manage.py && -d agri_backend ]]; then
  :
else
  echo "Cannot find Django project (expected manage.py here or under backend/)." >&2
  exit 1
fi

exec gunicorn agri_backend.wsgi:application --bind "0.0.0.0:${PORT:-8000}"
