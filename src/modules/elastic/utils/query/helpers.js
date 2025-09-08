module.exports.fieldsWithWheights =  {
  visa: 10,
  summary: 10,
  themes: 10,
  zoneMotivations: 6,
  zoneDispositif: 6,
  zoneExpose: 3,
  zoneMoyens: 3,
  zoneIntroduction: 2,
  zoneAnnexes: 2,
  text: null,
};

module.exports.sort = function sort({ sort, date_type, order }) {
  if (sort === 'score' || sort === 'scorepub')
    return [{ _score: order || 'desc' }, { decision_date: 'desc' }, { _id: 'desc' }];

  if (sort === 'date') return [{ decision_date: order || 'desc' }, { _id: 'desc' }];

  if (date_type === 'update') return [{ _score: 'desc' }, { update_date: order || 'desc' }, { _id: 'desc' }];

  return [{ _score: 'desc' }, { decision_date: order || 'desc' }, { _id: 'desc' }];
}

module.exports.inverseSort = function inverseSort(sort) {
  return sort.map((sortRule) =>
    Object.entries(sortRule).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value === 'desc' ? 'asc' : value === 'asc' ? 'desc' : value }),
      {},
    ),
  );
}

module.exports.computeFunctionsScore = function computeFunctionsScore({ sort }) {
  if (sort !== 'scorepub') return undefined;
  return [
    {
      filter: {
        match: {
          publication: 'b',
        },
      },
      weight: 50,
    },
    {
      filter: {
        match: {
          publication: 'r',
        },
      },
      weight: 10,
    },
    {
      filter: {
        match: {
          publication: 'c',
        },
      },
      weight: 5,
    },
    {
      filter: {
        match: {
          publication: 'l',
        },
      },
      weight: 2,
    },
    {
      filter: {
        match: {
          publication: 'n',
        },
      },
      weight: 0.1,
    },
    {
      filter: {
        match: {
          lowInterest: true,
        },
      },
      weight: 0.1,
    },
    {
      filter: {
        match: {
          jurisdiction: 'ca',
        },
      },
      weight: 0.1,
    },
    {
      filter: {
        match: {
          jurisdiction: 'tj',
        },
      },
      weight: 0.1,
    },
    {
      filter: {
        match: {
          jurisdiction: 'tcom',
        },
      },
      weight: 0.1,
    },
  ];
}

module.exports.filterUniqueIn = function filterUniqueIn(array) {
    return array.reduce((acc, _) => acc.includes(_) ? acc : [...acc, _])
}

module.exports.whichJurisdiction = function whichJurisdiction({ jurisdiction }) {
    const [ firstJurisdiction = 'cc' ] = jurisdiction ?? []
    return jurisdiction?.length > 1 ? 'all' : firstJurisdiction
}