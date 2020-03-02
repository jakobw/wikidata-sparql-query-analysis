FROM jupyter/minimal-notebook

USER root

RUN apt-get update \
    && apt-get install -y nodejs npm

USER $NB_UID

RUN npm install -g ijavascript
RUN echo '{}' > package.json
RUN npm install sparqljs
RUN npm install lodash
RUN npm install traverse
