#!/usr/bin/env sh

: "${PUBLIC_URL}" # ensure API_HOST exists and exit otherwise
: "${MATCHER_URL}" # ensure API_HOST exists and exit otherwise
: "${WORKSPACE_ID}" # ensure API_HOST exists and exit otherwise
: "${QUESTIONS_URL}" # ensure API_HOST exists and exit otherwise

PUBLIC_URL_ENV=${PUBLIC_URL}
MATCHER_URL_ENV=${MATCHER_URL}
WORKSPACE_ID_ENV=${WORKSPACE_ID}
QUESTIONS_URL_ENV=${QUESTIONS_URL}

cd /usr/share/nginx/html

grep -rli 'PUBLIC_URL_REPLACE' * | xargs -i@ sed -i "s/PUBLIC_URL_REPLACE/${PUBLIC_URL_ENV}/g" @
grep -rli 'MATCHER_URL_REPLACE' * | xargs -i@ sed -i "s/MATCHER_URL_REPLACE/${MATCHER_URL_ENV}/g" @
grep -rli 'QUESTIONS_URL_REPLACE' * | xargs -i@ sed -i "s/QUESTIONS_URL_REPLACE/${QUESTIONS_URL_ENV}/g" @
grep -rli 'UUID_REPLACE' * | xargs -i@ sed -i "s/UUID_REPLACE/${WORKSPACE_ID_ENV}/g" @

