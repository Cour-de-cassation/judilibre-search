const { 
    FREE_SEARCH_SEPARATOR, 
    POURVOI_PATTERN, 
    ECLI_PATTERN, 
    DATE_PATTERN 
} = require("./filtersFreeText");
const { whichJurisdiction } = require("./helpers");

module.exports.filterByPublication = function filterByPublication({ publication }) {
  const isPublication = publication && Array.isArray(publication) && publication.length > 0;
  return isPublication && { terms: { publication } };
}

module.exports.filterByFormation = function filterByFormation({ formation }) {
  const isFormation = formation && Array.isArray(formation) && formation.length > 0;
  return isFormation && { terms: { formation } };
}

module.exports.filterByType = function filterByType({ type }) {
  const isType = type && Array.isArray(type) && type.length > 0;
  return isType && { terms: { type } };
}

module.exports.filterByLocation = function filterByLocation({ location }) {
  const isLocation = location && Array.isArray(location) && location.length > 0;
  return isLocation && { terms: { location } };
}

module.exports.filterBySolution = function filterBySolution({ solution }) {
  const isSolution = solution && Array.isArray(solution) && solution.length > 0;
  return isSolution && { terms: { solution } };
}

module.exports.filterByWithFileOfType = function filterByWithFileOfType({ withFileOfType }) {
  const isWithFileOfType = withFileOfType && Array.isArray(withFileOfType) && withFileOfType.length > 0;
  return isWithFileOfType && { terms: { withFileOfType } };
}

module.exports.filterByParticularInterest = function filterByParticularInterest({ particularInterest }) {
  const isParticularInterest = particularInterest;
  return isParticularInterest && { term: { particularInterest: true } };
}

module.exports.filterByChamber = function filterByChamber(chamber) {
  const isChamber = chamber && Array.isArray(chamber) && chamber.length > 0;
  if (!isChamber) return null;

  return {
    terms: {
      chamber: chamber.reduce((acc, item) => {
        if (item === 'allciv') return [...acc, 'civ1', 'civ2', 'civ3'];
        return [...acc, item];
      }, []),
    },
  };
}

module.exports.filterByJurisdiction = function filterByJurisdiction({ jurisdiction }) {
  const isJurisdiction = jurisdiction && Array.isArray(jurisdiction) && jurisdiction.length > 0;
  return { terms: { jurisdiction: isJurisdiction ? jurisdiction : ['cc'] } };
}

module.exports.filterByTheme = function filterByTheme({ theme, jurisdiction }) {
  const isTheme = theme && Array.isArray(theme) && theme.length > 0;
  if (!isTheme) return null;

  if (whichJurisdiction({ jurisdiction }) === 'cc') {
    return { terms: { themesFilter: theme.map((_) => _.toLowerCase) } };
  }

  const isNacSuite = (entry) => !/^\w+$/i.test(entry); // Warn: nac suite should be more than 1 word ? Other things can have more than 1 word
  return { terms: { themesFilter: theme.filter(isNacSuite) } };
}

module.exports.filterByEcli = function filterByEcli({ query: freeSearch }) {
  const eclisPattern = new RegExp(`${FREE_SEARCH_SEPARATOR.source}(${ECLI_PATTERN})`, 'g');
  const eclis = [...freeSearch.matchAll(eclisPattern)].map(([_, capture]) => capture);
  return eclis.length > 0 && { terms: { ecli: eclis } };
}

module.exports.filterByPourvoi = function filterByPourvoi({ query: freeSearch }) {
  const pourvoisPattern = new RegExp(`${FREE_SEARCH_SEPARATOR.source}(${POURVOI_PATTERN})`, 'g');
  const pourvois = [...freeSearch.matchAll(pourvoisPattern)].map(([_, capture]) => capture.replace(/\D/gm, ''));
  return pourvois.length > 0 && pourvois.map((_) => ({ wildcard: { number: { value: `*${_}` } } }));
}

module.exports.filterByDate = function filterByDate({ date_start, date_end, date_type = 'creation', query }) {
  const inputDate = DATE_PATTERN.exec(query);
  const searchDate = inputDate && `${inputDate[3]}-${inputDate[2]}-${inputDate[1]}`;

  const dateStart = date_start ?? (!date_end ? searchDate : null);
  const dateEnd = date_end ?? (!date_start ? searchDate : null);

  const isDateTime =
    (dateEnd && !/^\d\d\d\d-\d\d-\d\d$/.test(dateEnd)) || (dateStart && !/^\d\d\d\d-\d\d-\d\d$/.test(dateStart));

  const dateField =
    date_type === 'creation' && isDateTime
      ? 'decision_datetime'
      : date_type === 'creation' && !isDateTime
      ? 'decision_date'
      : date_type !== 'creation' && isDateTime
      ? 'update_datetime'
      : /*(date_type !== "creation" && !isDateTime) ? */ 'update_date';

  if (dateStart && dateEnd)
    return {
      range: {
        [dateField]: { gte: date_start, lte: date_end },
      },
    };

  if (dateStart)
    return {
      range: {
        [dateField]: { gte: date_start },
      },
    };

  if (dateEnd)
    return {
      range: {
        [dateField]: { lte: date_end },
      },
    };

  return null;
}

module.exports.buildFilter = function buildFilter(query, filterFn, ...filterFns) {
  if (!filterFn) return [];
  const filter = filterFn(query);
  if (!filter) return buildFilter(query, ...filterFns);
  return [filter, ...buildFilter(query, ...filterFns)];
}
