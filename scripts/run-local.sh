#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
COMPOSE="docker compose"
BUILD=""
DETACHED=""
TAIL_LOGS="false"
SHOULD_STOP="false"

print_usage() {
  cat <<'EOF'
Uso:
  scripts/run-local.sh [opcoes]

Opcoes:
  --build       Recria as imagens antes de iniciar.
  --detached    Sobe os containers em segundo plano.
  --logs        Mostra logs de api e web apos subir em segundo plano.
  --down        Para o ambiente local.
  --help        Mostra esta ajuda.

Servicos:
  Web:          http://localhost:3000
  API:          http://localhost:4000/api
  PostgreSQL:   localhost:5433
  DynamoDB:     http://localhost:8000
EOF
}

ensure_docker_compose() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker nao encontrado no PATH." >&2
    exit 1
  fi

  if ! docker compose version >/dev/null 2>&1; then
    echo "Docker Compose nao esta disponivel como 'docker compose'." >&2
    exit 1
  fi
}

show_services() {
  cat <<'EOF'

Ambiente local:
  Web:        http://localhost:3000
  API:        http://localhost:4000/api
  Login dev:  admin@base.local / admin123

Para acompanhar depois:
  docker compose logs -f api web
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --build)
      BUILD="--build"
      ;;
    --detached|-d)
      DETACHED="-d"
      ;;
    --logs)
      TAIL_LOGS="true"
      DETACHED="-d"
      ;;
    --down)
      SHOULD_STOP="true"
      ;;
    --help|-h)
      print_usage
      exit 0
      ;;
    *)
      echo "Opcao desconhecida: $1" >&2
      print_usage
      exit 1
      ;;
  esac
  shift
done

cd "$ROOT_DIR"
ensure_docker_compose

if [ "$SHOULD_STOP" = "true" ]; then
  $COMPOSE down
  exit 0
fi

$COMPOSE up $BUILD $DETACHED

show_services

if [ "$TAIL_LOGS" = "true" ]; then
  $COMPOSE logs -f api web
fi
