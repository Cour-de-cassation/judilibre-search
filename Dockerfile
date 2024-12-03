#######################
# Step 1: Base target #
#######################
FROM node:20-alpine3.20 as base
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry

RUN apk add curl

# use proxy & private npm registry
RUN if [ ! -z "$http_proxy" ] ; then \
        npm config delete proxy; \
        npm config set proxy $http_proxy; \
        npm config set https-proxy $https_proxy; \
        npm config set no-proxy $no_proxy; \
   fi ; \
   [ -z "$npm_registry" ] || npm config set registry=$npm_registry

################################
# Step 2: "development" target #
################################
FROM base as development
ARG NPM_VERBOSE
ENV NPM_CONFIG_LOGLEVEL debug

WORKDIR /home/node/
USER node

COPY --chown=node:node . .

RUN if [ -z "${NPM_VERBOSE}" ]; then\
      npm install;  \
    else \
      npm install --verbose; \
    fi

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
COPY package.json package-lock.json ./
RUN chown node package-lock.json
USER node


# Install production dependencies and clean cache
RUN npm install --production 
RUN npm config set audit-level moderate 
#RUN npm audit --json --registry=https://registry.npmjs.org || ${NPM_AUDIT_DRY_RUN:-false} && \
RUN npm cache clean --force

ADD src/ ./src

# Expose the listening port of your app
EXPOSE ${API_PORT}

# HEALTHCHECK --interval=5m --timeout=2m --start-period=45s \
#   CMD curl -f --silent --retry 6 --max-time 5 --retry-delay 10 --retry-max-time 60 "http://localhost:${API_PORT}/healthcheck" || bash -c 'kill -s 15 -1 && (sleep 10; kill -s 9 -1)'

CMD ["node","./src"]
