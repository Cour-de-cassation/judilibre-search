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
          queryResponse.body.hits.hits[0].highlight['text'] &&
          queryResponse.body.hits.hits[0].highlight['text'].length > 0
        ) {
          highlightedText = queryResponse.body.hits.hits[0].highlight['text'][0];
        } else if (
          queryResponse.body.hits.hits[0].highlight['text.exact'] &&
          queryResponse.body.hits.hits[0].highlight['text.exact'].length > 0
        ) {
          highlightedText = queryResponse.body.hits.hits[0].highlight['text.exact'][0];
        }
        if (highlightedText !== null) {
          // Rebuild zoning to integrate highlights:
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
          let highlightedFlattenZones = JSON.parse(JSON.stringify(flattenZones));
          for (let i = 0; i < flattenZones.length; i++) {
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

            while (sourceIndex < end) {
              if (!inTag && rawResult._source.text[sourceIndex] === highlightedText[highlightIndex]) {
                sourceIndex++;
                highlightIndex++;
              } else {
                if (inTag) {
                  if (highlightedText[highlightIndex] === '>') {
                    inTag = false;
                  }
                } else {
                  if (highlightedText[highlightIndex] === '<') {
                    inTag = true;
                  }
                }
                highlightIndex++;
                highlightedFlattenZones[i].end++;
              }
            }
          }
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

    response = {
      id: rawResult._id,
      source: rawResult._source.source,
      text: highlightedText ? highlightedText : rawResult._source.text,
      chamber:
        query.resolve_references && taxons.chamber.taxonomy[rawResult._source.chamber]
          ? taxons.chamber.taxonomy[rawResult._source.chamber]
          : rawResult._source.chamber,
      decision_date: rawResult._source.decision_date,
      ecli: rawResult._source.ecli,
      jurisdiction:
        query.resolve_references && taxons.jurisdiction.taxonomy[rawResult._source.jurisdiction]
          ? taxons.jurisdiction.taxonomy[rawResult._source.jurisdiction]
          : rawResult._source.jurisdiction,
      number: rawResult._source.numberFull,
      publication: query.resolve_references
        ? rawResult._source.publication.map((key) => {
            if (taxons.publication.taxonomy[key]) {
              return taxons.publication.taxonomy[key];
            }
            return key;
          })
        : rawResult._source.publication,
      solution:
        query.resolve_references && taxons.solution.taxonomy[rawResult._source.solution]
          ? taxons.solution.taxonomy[rawResult._source.solution]
          : rawResult._source.solution,
      solution_alt: rawResult._source.solution_alt,
      type:
        query.resolve_references && taxons.type.taxonomy[rawResult._source.type]
          ? taxons.type.taxonomy[rawResult._source.type]
          : rawResult._source.type,
      formation:
        query.resolve_references && taxons.formation.taxonomy[rawResult._source.formation]
          ? taxons.formation.taxonomy[rawResult._source.formation]
          : rawResult._source.formation,
      update_date: rawResult._source.update_date,
      summary: rawResult._source.summary,
      themes: rawResult._source.themes,
      bulletin: rawResult._source.bulletin,
      files: rawResult._source.files,
      zones: highlightedZoning ? highlightedZoning : rawResult._source.zones,
      visa: rawResult._source.visa.map((item) => {
        return {
          title: item,
        };
      }),
      rapprochements: rawResult._source.rapprochements.map((item) => {
        return {
          title: item,
        };
      }),
    };
  }

  return response;
}

function decisionWithoutElastic(query) {
  const fs = require('fs');
  const path = require('path');

  let response = null;

  if (query.resolve_references) {
    response = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_detail_resolved.json')).toString(),
    );
  } else {
    response = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_detail_unresolved.json')).toString(),
    );
  }

  response.id = query.id;

  return response;
}

module.exports = decision;
