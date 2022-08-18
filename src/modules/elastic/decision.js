require('../env');
const taxons = require('../../taxons');

async function decision(query) {
  if (process.env.WITHOUT_ELASTIC) {
    return decisionWithoutElastic.apply(this, [query]);
  }

  let rawResponse;
  let response = null;

  try {
    rawResponse = await this.client.get({
      id: query.id,
      index: process.env.ELASTIC_INDEX,
      _source: true,
    });
  } catch (e) {
    console.error(e);
    rawResponse = null;
  }

  if (rawResponse && rawResponse.body && rawResponse.body.found) {
    let rawResult = rawResponse.body;
    let highlightedText = null;
    let highlightedZoning = null;

    if (query.query) {
      // Actual search query is required for hightlighting:
      const searchQuery = this.buildQuery(query, 'decision');
      const queryResponse = await this.client.search(searchQuery.query);
      if (
        queryResponse &&
        queryResponse.body &&
        queryResponse.body.hits &&
        queryResponse.body.hits.hits &&
        queryResponse.body.hits.hits.length > 0 &&
        queryResponse.body.hits.hits[0].highlight
      ) {
        if (
          queryResponse.body.hits.hits[0].highlight['displayText'] &&
          queryResponse.body.hits.hits[0].highlight['displayText'].length > 0
        ) {
          highlightedText = queryResponse.body.hits.hits[0].highlight['displayText'][0];
        } else if (
          queryResponse.body.hits.hits[0].highlight['displayText.exact'] &&
          queryResponse.body.hits.hits[0].highlight['displayText.exact'].length > 0
        ) {
          highlightedText = queryResponse.body.hits.hits[0].highlight['displayText.exact'][0];
        }
        if (highlightedText !== null) {
          // Rebuild zoning to integrate highlights:
          let zoningRebuildFailed = false;
          let flattenZones = [];
          for (let zone in rawResult._source.zones) {
            rawResult._source.zones[zone].forEach((fragment) => {
              flattenZones.push({
                zone: zone,
                start: fragment.start,
                end: fragment.end,
              });
            });
          }
          flattenZones.sort((a, b) => {
            if (a.start < b.start) {
              return -1;
            }
            if (a.start > b.start) {
              return 1;
            }
            return 0;
          });
          let highlightedFlattenZones = [];
          for (let i = 0; i < flattenZones.length; i++) {
            highlightedFlattenZones[i] = {
              zone: flattenZones[i].zone,
              start: flattenZones[i].start,
              end: flattenZones[i].end,
            };
            let start = flattenZones[i].start;
            let end = flattenZones[i].end;
            let sourceIndex = start;
            let inTag = false;
            if (i > 0) {
              let offset = highlightedFlattenZones[i - 1].end - highlightedFlattenZones[i].start;
              highlightedFlattenZones[i].start = highlightedFlattenZones[i - 1].end;
              highlightedFlattenZones[i].end += offset;
            }
            let highlightIndex = highlightedFlattenZones[i].start;
            let tagLength = 0;
            while (zoningRebuildFailed === false && sourceIndex < end) {
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
      }
    }

    rawResult._source.publication = rawResult._source.publication.filter((item) => {
      return /[br]/i.test(item);
    });

    let taxonFilter = rawResult._source.jurisdiction;

    response = {
      id: rawResult._id,
      source: rawResult._source.source,
      text: highlightedText ? highlightedText : rawResult._source.displayText,
      chamber:
        query.resolve_references && taxons[taxonFilter].chamber.taxonomy[rawResult._source.chamber]
          ? taxons[taxonFilter].chamber.taxonomy[rawResult._source.chamber]
          : rawResult._source.chamber,
      decision_date: rawResult._source.decision_date,
      ecli: rawResult._source.ecli,
      jurisdiction:
        query.resolve_references && taxons[taxonFilter].jurisdiction.taxonomy[rawResult._source.jurisdiction]
          ? taxons[taxonFilter].jurisdiction.taxonomy[rawResult._source.jurisdiction]
          : rawResult._source.jurisdiction,
      number: Array.isArray(rawResult._source.numberFull)
        ? rawResult._source.numberFull[0]
        : rawResult._source.numberFull,
      numbers: Array.isArray(rawResult._source.numberFull)
        ? rawResult._source.numberFull
        : [rawResult._source.numberFull],
      publication: query.resolve_references
        ? rawResult._source.publication.map((key) => {
            if (taxons[taxonFilter].publication.taxonomy[key]) {
              return taxons[taxonFilter].publication.taxonomy[key];
            }
            return key;
          })
        : rawResult._source.publication,
      solution:
        query.resolve_references && taxons[taxonFilter].solution.taxonomy[rawResult._source.solution]
          ? taxons[taxonFilter].solution.taxonomy[rawResult._source.solution]
          : rawResult._source.solution,
      solution_alt: rawResult._source.solution_alt,
      type:
        query.resolve_references && taxons[taxonFilter].type.taxonomy[rawResult._source.type]
          ? taxons[taxonFilter].type.taxonomy[rawResult._source.type]
          : rawResult._source.type,
      formation:
        query.resolve_references && taxons[taxonFilter].formation.taxonomy[rawResult._source.formation]
          ? taxons[taxonFilter].formation.taxonomy[rawResult._source.formation]
          : rawResult._source.formation,
      location:
        query.resolve_references && taxons[taxonFilter].location.taxonomy[rawResult._source.location]
          ? taxons[taxonFilter].location.taxonomy[rawResult._source.location]
          : rawResult._source.location,
      update_date: rawResult._source.update_date,
      summary: rawResult._source.summary,
      themes: rawResult._source.themes,
      nac: rawResult._source.nac ? rawResult._source.nac : null,
      portalis: rawResult._source.portalis ? rawResult._source.portalis : null,
      bulletin: rawResult._source.bulletin,
      files: taxons[taxonFilter].filetype.buildFilesList(
        rawResult._id,
        rawResult._source.files,
        query.resolve_references,
      ),
      zones: highlightedZoning ? highlightedZoning : rawResult._source.zones,
      contested: rawResult._source.contested ? rawResult._source.contested : null,
      forward: rawResult._source.forward ? rawResult._source.forward : null,
      timeline: rawResult._source.timeline ? rawResult._source.timeline : null,
      partial: rawResult._source.partial ? rawResult._source.partial : false,
      visa: rawResult._source.visa
        ? rawResult._source.visa.map((item) => {
            return {
              title: item,
            };
          })
        : [],
      rapprochements:
        rawResult._source.rapprochements && rawResult._source.rapprochements.value
          ? rawResult._source.rapprochements.value
          : [],
    };

    if (response.type === 'undefined') {
      delete response.type;
    }

    if (rawResult._source.jurisdiction === 'cc') {
      response.number = formatPourvoiNumber(response.number);
      response.numbers = response.numbers.map(formatPourvoiNumber);
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
  }

  return response;
}

function formatPourvoiNumber(str) {
  str = `${str}`.trim();
  if (/^\d{2}\D\d{2}\D\d{3}$/.test(str) === false) {
    str = str.replace(/\D/gim, '').trim();
    str = `${str.substring(0, 2)}-${str.substring(2, 4)}.${str.substring(4)}`;
  }
  return str;
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

  return response;
}

module.exports = decision;
