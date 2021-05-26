#######################
# Step 1: Base target #
#######################
FROM node:14-slim as base
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG MIRROR_DEBIAN
ARG NPM_LATEST

# update debian w/proxy & mirror
RUN echo "$http_proxy $no_proxy" && set -x && [ -z "$MIRROR_DEBIAN" ] || \
   sed -i.orig -e "s|http://deb.debian.org\([^[:space:]]*\)|$MIRROR_DEBIAN/debian9|g ; s|http://security.debian.org\([^[:space:]]*\)|$MIRROR_DEBIAN/debian9-security|g" /etc/apt/sources.list

# use proxy & private npm registry
RUN if [ ! -z "$http_proxy" ] ; then \
        npm config delete proxy; \
        npm config set proxy $http_proxy; \
        npm config set https-proxy $https_proxy; \
        npm config set no-proxy $no_proxy; \
   fi ; \
   [ -z "$npm_registry" ] || npm config set registry=$npm_registry

RUN [ -z "${NPM_LATEST}" ] || npm i npm@latest -g

################################
# Step 2: "development" target #
################################
FROM base as development
ARG NPM_FIX
ARG NPM_VERBOSE
ARG APP_ID
ARG API_PORT
ENV APP_ID=${APP_ID}
ENV API_PORT=${API_PORT}
ENV NPM_CONFIG_LOGLEVEL debug

WORKDIR /home/node/
USER node

COPY package.json ./

RUN if [ -z "${NPM_VERBOSE}" ]; then\
      npm install;  \
    else \
      npm install --verbose; \
    fi

VOLUME /${APP_ID}/src

COPY jestconfig.json .eslintrc.json ./

# Expose the listening port of your app
EXPOSE ${API_PORT}

CMD ["npm","run", "dev"]

###############################
# Step 3: "production" target #
###############################
FROM base as production
ARG NPM_AUDIT_DRY_RUN
ENV APP_ID=judilibre-search
ENV API_PORT=8080
ENV NODE_ENV=production

WORKDIR /home/node/
USER node

COPY package.json package-lock.json ./

# Install production dependencies and clean cache
RUN npm install --production && \
    npm config set audit-level moderate && \
    npm audit --json --registry=https://registry.npmjs.org || ${NPM_AUDIT_DRY_RUN:-false} && \
    npm cache clean --force

ADD src/ ./src

# Expose the listening port of your app
EXPOSE ${API_PORT}

HEALTHCHECK --interval=5m --timeout=2m --start-period=45s \
   CMD curl -f --silent --retry 6 --max-time 5 --retry-delay 10 --retry-max-time 60 "http://localhost:${API_PORT}/healthcheck" || bash -c 'kill -s 15 -1 && (sleep 10; kill -s 9 -1)'

CMD ["npm","run", "start"]
