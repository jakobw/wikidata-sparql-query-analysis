FROM jupyter/minimal-notebook

USER root

RUN apt-get update \
    && apt-get install -y nodejs npm ipython ipython-notebook

USER $NB_USER

RUN npm install -g ijavascript
RUN echo '{}' > package.json
RUN npm install sparqljs
RUN npm install lodash
RUN npm install traverse
