const taxons = require('../../../taxons');

function formatElasticToResponse(rawResult, query) {
  const sourceName = rawResult._source.jurisdiction;

  const response = {
    id: rawResult._id,
    source: rawResult._source.source,
    text: highlightedText ? highlightedText : rawResult._source.displayText,
    chamber:
      query.resolve_references && taxons[sourceName].chamber.taxonomy[rawResult._source.chamber]
        ? taxons[sourceName].chamber.taxonomy[rawResult._source.chamber]
        : rawResult._source.chamber,
    decision_date: rawResult._source.decision_date,
    decision_datetime: rawResult._source.decision_datetime,
    ecli: rawResult._source.ecli,
    jurisdiction:
      query.resolve_references && taxons[sourceName].jurisdiction.taxonomy[rawResult._source.jurisdiction]
        ? taxons[sourceName].jurisdiction.taxonomy[rawResult._source.jurisdiction]
        : rawResult._source.jurisdiction,
    number: Array.isArray(rawResult._source.numberFull)
      ? rawResult._source.numberFull[0]
      : rawResult._source.numberFull,
    numbers: Array.isArray(rawResult._source.numberFull)
      ? rawResult._source.numberFull
      : [rawResult._source.numberFull],
    publication:
      query.resolve_references && rawResult._source.publication
        ? rawResult._source.publication.map((key) => {
            if (taxons[sourceName].publication.taxonomy[key]) {
              return taxons[sourceName].publication.taxonomy[key];
            }
            return key;
          })
        : rawResult._source.publication,
    solution:
      query.resolve_references && taxons[sourceName].solution.taxonomy[rawResult._source.solution]
        ? taxons[sourceName].solution.taxonomy[rawResult._source.solution]
        : rawResult._source.solution,
    solution_alt: rawResult._source.solution_alt,
    type:
      query.resolve_references && taxons[sourceName].type.taxonomy[rawResult._source.type]
        ? taxons[sourceName].type.taxonomy[rawResult._source.type]
        : rawResult._source.type,
    formation:
      query.resolve_references && taxons[sourceName].formation.taxonomy[rawResult._source.formation]
        ? taxons[sourceName].formation.taxonomy[rawResult._source.formation]
        : rawResult._source.formation,
    location:
      query.resolve_references && taxons[sourceName].location.taxonomy[rawResult._source.location]
        ? taxons[sourceName].location.taxonomy[rawResult._source.location]
        : rawResult._source.location,
    update_date: rawResult._source.update_date,
    update_datetime: rawResult._source.update_datetime,
    summary: rawResult._source.summary,
    themes: rawResult._source.themes,
    nac: rawResult._source.nac ? rawResult._source.nac : null,
    portalis: rawResult._source.portalis ? rawResult._source.portalis : null,
    bulletin: rawResult._source.bulletin,
    files:
      taxons[sourceName] && taxons[sourceName].filetype && taxons[sourceName].filetype.buildFilesList
        ? taxons[sourceName].filetype.buildFilesList(rawResult._id, rawResult._source.files, query.resolve_references)
        : [],
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
    legacy: rawResult._source.legacy ? rawResult._source.legacy : {},
    titlesAndSummaries: rawResult._source.titlesAndSummaries ? rawResult._source.titlesAndSummaries : [],
    particularInterest: rawResult._source.particularInterest === true,
  };

  return response;
}

module.exports = { formatElasticToResponse };
