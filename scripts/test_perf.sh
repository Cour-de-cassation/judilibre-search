#!/bin/sh

cat $(pwd)/scripts/perf/api_test.yaml | envsubst > $(pwd)/scripts/perf/api_test_configured.yaml

mkdir -p $(pwd)/scripts/perf/reports

docker run --rm -it -v $(pwd)/scripts/perf:/scripts -v $(pwd)/scripts/perf/reports:/reports \
  --network host \
  artilleryio/artillery:latest \
  run /scripts/api_test_configured.yaml --output /reports/report.json