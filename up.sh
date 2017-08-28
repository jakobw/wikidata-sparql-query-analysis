#!/bin/bash

WORKDIR=/home/jovyan/notebooks

docker run \
  -it \
  -p '8888:8888' \
  -v $(pwd)/notebooks:$WORKDIR \
  query_analysis \
  ijsnotebook --ijs-working-dir=$WORKDIR
