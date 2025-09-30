const taxons = require('../../../taxons');
const { INITIAL_VALUE } = require('./pagination');
const { fieldsWithWheights } = require('./query/helpers');

function formatPourvoiNumber(str) {
  str = `${str}`.trim();
  if (/^\d{2}\D\d{2}\D\d{3}$/.test(str) === false) {
    str = str.replace(/\D/gim, '').trim();
    str = `${str.substring(0, 2)}-${str.substring(2, 4)}.${str.substring(4)}`;
  }
  return str;
}

module.exports.formatNumber = function formatNumber({ numberFull, jurisdiction }) {
  if (jurisdiction === 'cc') return formatPourvoiNumber(numberFull);
  return Array.isArray(numberFull) ? numberFull[0] : numberFull;
};

module.exports.formatNumbers = function formatNumbers({ numberFull, jurisdiction }) {
  if (jurisdiction === 'cc') return numberFull ? numberFull.map(formatPourvoiNumber) : numberFull;
  return Array.isArray(numberFull) ? numberFull : [numberFull];
};

module.exports.formatType = function formatType(result, query) {
  return query.resolveReference && taxons[result.jurisdiction].type.taxonomy[result.type]
    ? taxons[result.jurisdiction].type.taxonomy[result.type]
    : type;
};

module.exports.formatJurisdiction = function formatJurisdiction(result, query) {
  return query.resolve_references && taxons[result.jurisdiction].jurisdiction.taxonomy[result.jurisdiction]
    ? taxons[result.jurisdiction].jurisdiction.taxonomy[result.jurisdiction]
    : result.jurisdiction;
};

module.exports.formatChamber = function formatChamber(result, query) {
  return query.resolve_references && taxons[result.jurisdiction].chamber.taxonomy[result.chamber]
    ? taxons[result.jurisdiction].chamber.taxonomy[result.chamber]
    : result.chamber;
};

module.exports.formatFormation = function formatFormation(result, query) {
  return query.resolve_references && taxons[result.jurisdiction].formation.taxonomy[result.formation]
    ? taxons[result.jurisdiction].formation.taxonomy[result.formation]
    : result.formation;
};

module.exports.formatLocation = function formatLocation(result, query) {
  return query.resolve_references && taxons[result.jurisdiction].location.taxonomy[result.location]
    ? taxons[result.jurisdiction].location.taxonomy[result.location]
    : result.location;
};

module.exports.formatSolution = function formatSolution(result, query) {
  return query.resolve_references && taxons[result.jurisdiction].solution.taxonomy[result.solution]
    ? taxons[result.jurisdiction].solution.taxonomy[result.solution]
    : result.solution;
};

module.exports.formatPublication = function formatPublication(result, query) {
  return query.resolve_references && result.publication
    ? result.publication.map((key) => taxons[sourceName].publication.taxonomy[key] ?? key)
    : result.publication;
};

module.exports.formatFiles = function formatFiles(id, result, query) {
  return taxons[sourceName]?.filetype?.buildFilesList
    ? taxons[sourceName].filetype.buildFilesList(id, result.files, query.resolve_references)
    : [];
};

module.exports.formatHighlights = function formatHighlights(highlight) {
  const fields = Object.entries(fieldsWithWheights);

  const hasZone = fields.some(([_, value]) => value.taxonomie !== 'text' && /zone/i.test(value));
  return fields.reduce((acc, [key, field]) => {
    if (hasZone && field.taxonomie === 'text') return acc;

    const highlightFounded = highlight[key] ?? highlight[key + '.exact'] ?? [];
    return {
      ...acc,
      [field.taxonomie]: highlightFounded.map((_) =>
        _.replace(/^[^a-z<>]*/gim, '')
          .replace(/[^a-z<>]*$/gim, '')
          .replace(/X+/gm, '…')
          .trim(),
      ),
    };
  }, {});
};

module.exports.formatQueryToUrlParams = function formatQueryToUrlParams(query) {
  const pageParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((_) => pageParams.append(key, _));
    else pageParams.append(key, value);
  });
  return pageParams.toString();
};

module.exports.formatCursorToUrlParams = function formatCursorToUrlParams(query, searchAfter) {
  const { searchAfter: _, ...relevantQuery } = query;
  if (!searchAfter) return null;
  if (searchAfter === INITIAL_VALUE) return formatQueryIntoUrlParams(relevantQuery);
  return formatQueryIntoUrlParams({ ...relevantQuery, searchAfter: searchAfter.join('&') });
};

module.exports.formatUrlParamsToCursor = function formatUrlParamsToCursor(query) {
  const rawSearchAfter = query.searchAfter.split('&');
  return [Number(rawSearchAfter[0]), Number(rawSearchAfter[1]), rawSearchAfter[2]];
};
