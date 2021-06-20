#!/bin/sh

#set version from package & git / could be git tag instead
if [ -z "${VERSION}" ];then\
        export VERSION="$(cat package.json | jq -r '.version')-$(git rev-parse --short HEAD)"
fi

export PERF_ID=${KUBE_ZONE}-${GIT_BRANCH}-${VERSION}_APP_${APP_NODES}_ES_${ELASTIC_NODES}_${ELASTIC_MEM_JVM}

cat $(pwd)/scripts/perf/api_test.yaml | envsubst > $(pwd)/scripts/perf/api_test_configured.yaml

mkdir -p $(pwd)/scripts/perf/reports

docker run --rm -it -v $(pwd)/scripts/perf:/scripts -v $(pwd)/scripts/perf/reports:/reports \
  --network host \
  artilleryio/artillery:latest \
  run /scripts/api_test_configured.yaml --output /reports/report_${PERF_ID}.json

docker run --rm -it -v $(pwd)/scripts/perf/reports:/reports \
  --network host \
  artilleryio/artillery:latest \
  report /reports/report_${PERF_ID}.json --output /reports/report_${PERF_ID}.html
