const { formatUrlParamsIntoSearchAfter } = require("./format");

function buildSort({ date_type, order }) {
  switch (date_type) {
    case 'update':
      return [{ _score: 'desc' }, { update_date: order || 'desc' }, { _id: 'desc' }];
    default:
      return [{ _score: 'desc' }, { decision_date: order || 'desc' }, { _id: 'desc' }];
  }
}

function filterByPublication({ publication }) {
  const isPublication = publication && Array.isArray(publication) && publication.length > 0;
  return isPublication && { terms: { publication } };
}

function filterByFormation({ formation }) {
  const isFormation = formation && Array.isArray(formation) && formation.length > 0;
  return isFormation && { terms: { formation } };
}

function filterByType({ type }) {
  const isType = type && Array.isArray(type) && type.length > 0;
  return isType && { terms: { type } };
}

function filterByLocation({ location }) {
  const isLocation = location && Array.isArray(location) && location.length > 0;
  return isLocation && { terms: { location } };
}

function filterBySolution({ solution }) {
  const isSolution = solution && Array.isArray(solution) && solution.length > 0;
  return isSolution && { terms: { solution } };
}

function filterByWithFileOfType({ withFileOfType }) {
  const isWithFileOfType = withFileOfType && Array.isArray(withFileOfType) && withFileOfType.length > 0;
  return isWithFileOfType && { terms: { withFileOfType } };
}

function filterByParticularInterest({ particularInterest }) {
  const isParticularInterest = particularInterest;
  return isParticularInterest && { terms: { particularInterest: true } };
}

function filterByChamber(chamber) {
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

function filterByJurisdiction({ jurisdiction }) {
  const isJurisdiction = jurisdiction && Array.isArray(jurisdiction) && jurisdiction.length > 0;
  return { terms: { jurisdiction: isJurisdiction ? jurisdiction : ['cc'] } };
}

function filterByDate({ date_start, date_end, date_type }) {
  const isDateStart = !!date_start;
  const isDateEnd = !!date_end;
  const isDateTime =
    // Warn: I don't understand why it's true
    (isDateEnd && !/^\d\d\d\d-\d\d-\d\d$/.test(date_end)) ||
    (isDateStart && !/^\d\d\d\d-\d\d-\d\d$/.test(date_start));

  const dateField =
    date_type === 'creation' && isDateTime
      ? 'decision_datetime'
      : date_type === 'creation' && !isDateTime
      ? 'decision_date'
      : date_type !== 'creation' && isDateTime
      ? 'update_datetime'
      : /*(date_type !== "creation" && !isDateTime) ? */ 'update_date';

  if (isDateStart && isDateEnd)
    return {
      range: {
        [dateField]: { gte: date_start, lte: date_end },
      },
    };

  if (isDateStart)
    return {
      range: {
        [dateField]: { gte: date_start },
      },
    };

  if (isDateEnd)
    return {
      range: {
        [dateField]: { lte: date_end },
      },
    };

  return null;
}

function filterByTheme({ theme, jurisdiction }) {
  const isTheme = theme && Array.isArray(theme) && theme.length > 0;
  if (!isTheme) return null;

  const isJurisdiction = jurisdiction && Array.isArray(jurisdiction) && jurisdiction.length > 0;
  const isCassation = isJurisdiction ? jurisdiction.every((_) => _ === 'cc') : true; // cassation only if jurisdiction = ['cc']

  if (isCassation) {
    return { terms: { themesFilter: theme.map((_) => _.toLowerCase) } };
  }

  const isNacSuite = (entry) => !/^\w+$/i.test(entry); // Warn: nac suite should be more than 1 word ? Other things can have more than 1 word
  return { terms: { themesFilter: theme.filter(isNacSuite) } };
}

function filterByThemeFromSearchString({ theme, jurisdiction }) {
  // Warn: complete theme search
  const isTheme = theme && Array.isArray(theme) && theme.length > 0;
  if (!isTheme) return null;

  const isJurisdiction = jurisdiction && Array.isArray(jurisdiction) && jurisdiction.length > 0;
  const isCassation = isJurisdiction ? jurisdiction.every((_) => _ === 'cc') : true;
  const isUnknown = (entry) => !!/^\w+$/i.test(entry);

  if (isCassation) return null;
  const themesToSearchByString = theme.filter(isUnknown);

  return {
    simple_query_string: {
      query: themesToSearchByString.join(' '),
      fields: ['themes'],
      default_operator: 'AND',
      auto_generate_synonyms_phrase_query: false,
    },
  };
}

function buildFilter(query, filterFn, ...filterFns) {
  if (!filterFn) return [];
  const filter = filterFn(query);
  if (!filter) return buildFilter(query, ...filterFns);
  return [filter, ...buildFilter(query, ...filterFns)];
}

function buildQuery(query) {
  return {
    index: process.env.ELASTIC_INDEX,
    preference: 'preventbouncingresults',
    explain: false,
    size: query.batch_size || 10,
    _source: true,
    body: {
      track_scores: false,
      query: {
        function_score: {
          query: {
            bool: {
              filter: buildFilter(
                query,
                filterByChamber,
                filterByDate,
                filterByFormation,
                filterByJurisdiction,
                filterByLocation,
                filterByParticularInterest,
                filterByPublication,
                filterBySolution,
                filterByTheme,
                filterByType,
                filterByWithFileOfType,
              ),
              must: filterByThemeFromSearchString(query),
            },
          },
        },
      },
      ...(query.searchAfter ? { search_after: formatUrlParamsIntoSearchAfter(query) } : {}),
      sort: buildSort(query),
    },
  };
}

module.exports = { buildQuery, filterByDate, filterByJurisdiction, filterByLocation, filterByParticularInterest, buildFilter }