#!/bin/bash

node bin/letsencrypt certonly \
  --agree-tos --email 'coolaj86+le.1010@gmail.com' \
  --standalone \
  --domains pokemap.hellabit.com,www.pokemap.hellabit.com \
  --server https://acme-staging.api.letsencrypt.org/directory \
  --config-dir ~/letsencrypt.test2/etc
