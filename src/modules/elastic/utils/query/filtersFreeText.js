const taxons = require('../../../../taxons');
const { filterUniqueIn, whichJurisdiction, fieldsWithWheights } = require('./helpers');

const FREE_SEARCH_SEPARATOR = /[\s,;/?!]+/;
const DATE_PATTERN = /(\d\d)\/(\d\d)\/(\d\d\d\d)/;
const ECLI_PATTERN = /ecli:\w+:\w+:\d+:[a-z0-9.]+/;
const POURVOI_PATTERN = /\D?\d\d\D?\d\d\D?\d\d\d\D?/;

module.exports.FREE_SEARCH_SEPARATOR = FREE_SEARCH_SEPARATOR;
module.exports.DATE_PATTERN = DATE_PATTERN;
module.exports.ECLI_PATTERN = ECLI_PATTERN;
module.exports.POURVOI_PATTERN = POURVOI_PATTERN;

module.exports.filterByFreeText = function filterByFreeText({ query }) {
  if (!query) return null;

  const freeText = query
    .trim()
    .replaceAll(DATE_PATTERN, '')
    .replaceAll(ECLI_PATTERN, '')
    .replaceAll(POURVOI_PATTERN, '');

  return freeText.split(FREE_SEARCH_SEPARATOR);
};

module.exports.filterByFreeTextTheme = function filterByFreeTextTheme({ theme, jurisdiction }) {
  const isTheme = theme && Array.isArray(theme) && theme.length > 0;
  if (!isTheme) return null;

  if (whichJurisdiction({ jurisdiction }) === 'cc') return null;

  return theme.filter((_) => !!/^\w+$/i.test(_));
};

function buildFreeText(query, filterFn, ...filterFns) {
  if (!filterFn) return [];

  return filterUniqueIn([...(filterFn(query)?.query ?? []), ...(buildFreeText(query, ...filterFns)?.query ?? [])]);
};

function isFieldTheme({ theme, jurisdiction }) {
  return !!filterByFreeTextTheme({ theme, jurisdiction });
}

function isFieldVisa({ query: freeSearch }) {
  return /article\D+\d/i.test(freeSearch);
}

function isExactSearch({ query: freeSearch, operator }) {
  return /"[^"]+"/.test(freeSearch) || operator === 'exact';
}

function getFieldsWheights(query, fields) {
  if (isExactSearch(query)) return fields.map((_) => (_ !== 'visa' ? `${_}.exact` : _));
  return fields.map((_) => (fieldsWithWheights[_] === null ? _ : `${_}^${fieldsWithWheights[_]}`));
}

function buildFreeFields(query) {
  const fields = [
    ...Object.keys(fieldsWithWheights).filter((_) => query.fields.includes(_)),
    ...(isFieldTheme(query) ? ['themes'] : []),
    ...(isFieldVisa(query) ? ['visa'] : []),
  ];

  if (fields.length <= 0) return getFieldsWheights(['text']);
  return getFieldsWheights(filterUniqueIn(fields));
};

function getOperatorAndFuzzy({ jurisdiction, query: freeSearch, operator }) {
  if (isExactSearch({ query: freeSearch, operator })) return { operator: 'AND', fuzzy: false };
  if (/[*()~|+-]/.test(freeSearch)) return { operator: 'AND', fuzzy: false };
  if (operator) return { operator: operator.toUpperCase(), fuzzy: true };

  const taxonFilter = whichJurisdiction({ jurisdiction });
  return { operator: taxons[taxonFilter].operator.default.toUpperCase(), fuzzy: true };
}

function buildOperator(query) {
  const { operator, fuzzy } = getOperatorAndFuzzy(query);
  return {
    default_operator: operator,
    auto_generate_synonyms_phrase_query: fuzzy,
    fuzzy_max_expansions: fuzzy ? 50 : 0,
    fuzzy_transpositions: fuzzy,
  };
};

module.exports.buildMust = function buildMustByFilters(query, ...filterFns) {
  return {
    simple_query_string: {
      query: buildFreeText(query, ...filterFns),
      fields: buildFreeFields(query),
      ...buildOperator(query)
    },
  };
};
