require('../../env');
const { formatPourvoiNumber, sortByAscendingNumber } = require('../common/format');
const { formatElasticToResponse } = require('./format');

async function decision(query) {
  if (process.env.WITHOUT_ELASTIC) {
    return decisionWithoutElastic.apply(this, [query]);
  }

  try {
    const rawResponse = await this.client.get({
      id: query.id,
      index: process.env.ELASTIC_INDEX,
      _source: true,
    });

    if (!rawResponse || !rawResponse.body || !rawResponse.body.found) {
      return null;
    }
    const rawResult = rawResponse.body;
    let highlightedText = null;
    let highlightedZoning = null;

    // Actual search query is required for hightlighting:
    const searchQuery = this.buildQuery(query, 'decision');
    const queryResponse = await this.client.search(searchQuery.query);
    const highlight = queryResponse.body.hits.hits[0].highlight;
    if (highlight && highlight.displayText?.length > 0) {
      highlightedText = highlight.displayText[0];
    }
    if (highlight && highlight.displayText?.exact?.length > 0) {
      highlightedText = highlight.displayText.exact[0];
    }
    if (highlightedText !== null) {
      // Rebuild zoning to integrate highlights:
      let zoningRebuildFailed = false;
      const flattenZones = Object.entries(rawResult._source.zones).flatMap(([zone, fragments]) =>
        fragments.map(({ start, end }) => ({ zone, start, end })),
      );
      const sortedFlattenZones = flattenZones.toSorted((a, b) => {
        return sortByAscendingNumber(a, b);
      });

      const highlightedFlattenZones = [];

      for (let i = 0; i < sortedFlattenZones.length; i++) {
        highlightedFlattenZones[i] = {
          zone: sortedFlattenZones[i].zone,
          start: sortedFlattenZones[i].start,
          end: sortedFlattenZones[i].end,
        };
        let start = sortedFlattenZones[i].start;
        let end = sortedFlattenZones[i].end;
        let sourceIndex = start;
        let inTag = false;
        if (i > 0) {
          let offset = highlightedFlattenZones[i - 1].end - highlightedFlattenZones[i].start;
          highlightedFlattenZones[i].start = highlightedFlattenZones[i - 1].end;
          highlightedFlattenZones[i].end += offset;
        }

        let highlightIndex = highlightedFlattenZones[i].start;
        let tagLength = 0;

        while (!zoningRebuildFailed && sourceIndex < end) {
          if (!inTag && rawResult._source.displayText[sourceIndex] === highlightedText[highlightIndex]) {
            sourceIndex++;
            highlightIndex++;
          } else {
            if (inTag) {
              tagLength++;
              if (tagLength > 5) {
                zoningRebuildFailed = true;
              }
              if (highlightedText[highlightIndex] === '>') {
                inTag = false;
              }
            } else {
              if (highlightedText[highlightIndex] === '<') {
                tagLength = 0;
                inTag = true;
              } else {
                zoningRebuildFailed = true;
              }
            }
            highlightIndex++;
            highlightedFlattenZones[i].end++;
          }
        }

        if (zoningRebuildFailed === true) {
          break;
        }
      }

      if (zoningRebuildFailed === true) {
        highlightedText = null;
        highlightedZoning = null;
      } else {
        highlightedZoning = {};
        highlightedFlattenZones.forEach((zone) => {
          if (highlightedZoning[zone.zone] === undefined) {
            highlightedZoning[zone.zone] = [];
          }
          highlightedZoning[zone.zone].push({
            start: zone.start,
            end: zone.end,
          });
        });
      }
    }
    rawResult._source.publication = rawResult._source.publication
      ? rawResult._source.publication.filter((item) => {
          return /[br]/i.test(item);
        })
      : [];

    const response = formatElasticToResponse(rawResult, highlightedText, query, highlightedZoning);

    if (response.type === 'undefined') {
      delete response.type;
    }

    if (rawResult._source.jurisdiction === 'cc') {
      response.number = formatPourvoiNumber(response.number);
      response.numbers = response.numbers ? response.numbers.map(formatPourvoiNumber) : response.numbers;
    }

    if (response.partial && response.zones) {
      delete response.zones;
    }

    if (Array.isArray(response.timeline) && response.timeline.length < 2) {
      delete response.timeline;
    }

    if (response.contested !== null && response.contested !== undefined) {
      for (let _key in response.contested) {
        if (Array.isArray(response.contested[_key])) {
          response.contested[_key] = response.contested[_key][0];
        }
      }
      if (response.contested.id) {
        response.contested.url = `${response.contested.id}`;
      } else if (response.contested.content) {
        let show_contested_params = new URLSearchParams(query);
        show_contested_params.set('showContested', true);
        response.contested.url = show_contested_params.toString();
      }
    }

    if (response.forward !== null && response.forward !== undefined) {
      for (let _key in response.forward) {
        if (Array.isArray(response.forward[_key])) {
          response.forward[_key] = response.forward[_key][0];
        }
      }
      if (response.forward.id) {
        response.forward.url = `${response.forward.id}`;
      } else if (response.forward.content) {
        let show_forward_params = new URLSearchParams(query);
        show_forward_params.set('showForward', true);
        response.forward.url = show_forward_params.toString();
      }
    }

    if (
      response.timeline !== null &&
      response.timeline !== undefined &&
      Array.isArray(response.timeline) &&
      response.timeline.length > 0
    ) {
      for (let t = 0; t < response.timeline.length; t++) {
        for (let _key in response.timeline[t]) {
          if (Array.isArray(response.timeline[t][_key])) {
            response.timeline[t][_key] = response.timeline[t][_key][0];
          }
        }
        if (response.timeline[t].id) {
          response.timeline[t].url = `${response.timeline[t].id}`;
        }
      }
    }

    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function decisionWithoutElastic(query) {
  const fs = require('fs');
  const path = require('path');

  let response = null;

  const allData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_list.json')).toString());
  const additionalData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'ca', 'sample_list.json')).toString(),
  );
  allData.unresolved = allData.unresolved.concat(additionalData.unresolved);
  const additionalData2 = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'tj', 'sample_list.json')).toString(),
  );
  allData.unresolved = allData.unresolved.concat(additionalData2.unresolved);
  const additionalData3 = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'tcom', 'sample_list.json')).toString(),
  );
  allData.unresolved = allData.unresolved.concat(additionalData3.unresolved);

  let found = null;
  for (let i = 0; i < allData.unresolved.length; i++) {
    if (allData.unresolved[i].id === query.id) {
      found = allData.unresolved[i].jurisdiction;
      break;
    }
  }
  if (found === null) {
    found = 'cc';
  }

  if (found === 'cc') {
    if (query.resolve_references) {
      response = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_detail_resolved.json')).toString(),
      );
    } else {
      response = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_detail_unresolved.json')).toString(),
      );
    }
  } else if (found === 'ca') {
    if (query.resolve_references) {
      response = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'ca', 'sample_detail_resolved.json')).toString(),
      );
    } else {
      response = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'ca', 'sample_detail_unresolved.json')).toString(),
      );
    }
  } else if (found === 'tj') {
    if (query.resolve_references) {
      response = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'tj', 'sample_detail_resolved.json')).toString(),
      );
    } else {
      response = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'tj', 'sample_detail_unresolved.json')).toString(),
      );
    }
  } else if (found === 'tcom') {
    if (query.resolve_references) {
      response = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'tcom', 'sample_detail_resolved.json')).toString(),
      );
    } else {
      response = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'tcom', 'sample_detail_unresolved.json')).toString(),
      );
    }
  }

  response.id = query.id;

  if (response.contested !== null && response.contested !== undefined) {
    if (response.contested.id) {
      response.contested.url = response.contested.id;
    } else if (response.contested.content) {
      let show_contested_params = new URLSearchParams(query);
      show_contested_params.set('showContested', true);
      response.contested.url = show_contested_params.toString();
    }
  }

  if (response.forward !== null && response.forward !== undefined) {
    if (response.forward.id) {
      response.forward.url = response.forward.id;
    } else if (response.forward.content) {
      let show_forward_params = new URLSearchParams(query);
      show_forward_params.set('showForward', true);
      response.forward.url = show_forward_params.toString();
    }
  }

  response.particularInterest = false;
  delete response.displayText;

  return response;
}

module.exports = decision;
