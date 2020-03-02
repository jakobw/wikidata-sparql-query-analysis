#!/bin/bash

WORKDIR=/home/jovyan/notebooks

docker run \
  -it \
  -p '8888:8888' \
  -v $(pwd)/notebooks:$WORKDIR \
  -e NB_UID=$(id -u) \
  -e NB_GID=$(id -g) \
  --user root \
  query_analysis \
  ijsnotebook --ijs-working-dir=$WORKDIR --allow-root
