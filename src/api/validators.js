const taxons = require('../taxons');

const AGGREGATION_KEYS = [
  'jurisdiction',
  'source',
  'location',
  'year',
  'month',
  'chamber',
  'formation',
  'solution',
  'type',
  'nac',
  'themes',
  'publication',
  'filetype',
];

const VALIDATORS = {
  JURISDICTIONS: {
    jurisdiction: {
      in: 'query',
      toArray: true,
    },
    'jurisdiction.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.jurisdiction.options],
      },
      errorMessage: `Value of the jurisdiction parameter must be in [${taxons.all.jurisdiction.keys}].`,
      optional: true,
    },
  },
  SOURCES: {
    source: {
      in: 'query',
      toArray: true,
    },
    'source.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.source.options],
      },
      errorMessage: `Value of the source parameter must be in [${taxons.all.source.keys}].`,
      optional: true,
    },
  },
  LOCATIONS: {
    location: {
      in: 'query',
      toArray: true,
    },
    'location.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.location.options],
      },
      errorMessage: `Value of the location parameter must be in [${taxons.all.location.keys}].`,
      optional: true,
    },
  },
  DATE_START: {
    date_start: {
      in: 'query',
      isString: true,
      isISO8601: true,
      errorMessage: `Start date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).`,
      optional: true,
    },
  },
  DATE_END: {
    date_end: {
      in: 'query',
      isString: true,
      isISO8601: true,
      errorMessage: `End date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).`,
      optional: true,
    },
  },
  DATE_TYPE: {
    date_type: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.date_type.options],
      },
      errorMessage: `Value of the date_type parameter must be in [${taxons.all.date_type.keys}].`,
      optional: true,
    },
  },
  PARTICULAR_INTEREST: {
    particularInterest: {
      in: 'query',
      isBoolean: true,
      toBoolean: true,
      errorMessage: `Value of the particularInterest parameter must be a boolean.`,
      optional: true,
    },
  },
  RESOLVE_REFERENCES: {
    resolve_references: {
      in: 'query',
      isBoolean: true,
      toBoolean: true,
      errorMessage: `Value of the resolve_references parameter must be a boolean.`,
      optional: true,
    },
  },
  TYPES: {
    type: {
      in: 'query',
      toArray: true,
    },
    'type.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.type.options],
      },
      errorMessage: `Value of the type parameter must be in [${taxons.all.type.keys}].`,
      optional: true,
    },
  },
  THEMES: {
    theme: {
      in: 'query',
      toArray: true,
    },
    'theme.*': {
      in: 'query',
      isString: true,
      errorMessage: `Theme parameter must be an array of strings.`,
      optional: true,
    },
  },
  CHAMBERS: {
    chamber: {
      in: 'query',
      toArray: true,
    },
    'chamber.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.chamber.options],
      },
      errorMessage: `Value of the chamber parameter must be in [${taxons.all.chamber.keys}].`,
      optional: true,
    },
  },
  FORMATIONS: {
    formation: {
      in: 'query',
      toArray: true,
    },
    'formation.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.formation.options],
      },
      errorMessage: `Value of the formation parameter must be in [${taxons.all.formation.keys}].`,
      optional: true,
    },
  },
  PUBLICATIONS: {
    publication: {
      in: 'query',
      toArray: true,
    },
    'publication.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.publication.options],
      },
      errorMessage: `Value of the publication parameter must be in [${taxons.all.publication.keys}].`,
      optional: true,
    },
  },
  SOLUTIONS: {
    solution: {
      in: 'query',
      toArray: true,
    },
    'solution.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.solution.options],
      },
      errorMessage: `Value of the solution parameter must be in [${taxons.all.solution.keys}].`,
      optional: true,
    },
  },
  STATS_AGGREGATION_KEYS: {
    keys: {
      in: 'query',
      toArray: true,
    },
    'keys.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [AGGREGATION_KEYS],
      },
      errorMessage: `Value of the keys parameter must be in [${AGGREGATION_KEYS}].`,
      optional: true,
    },
  },
  QUERY: {
    query: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the query parameter must be a string.`,
      optional: true,
    },
  },
  OPERATOR: {
    operator: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.operator.options],
      },
      errorMessage: `Value of the operator parameter must be in [${taxons.all.operator.keys}].`,
      optional: true,
    },
  },
  ORDER: {
    order: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.order.options],
      },
      errorMessage: `Value of the order parameter must be in [${taxons.all.order.keys}].`,
      optional: true,
    },
  },
  ID: {
    id: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the id parameter must be a string.`,
      optional: false,
      toLowerCase: true,
    },
  },
  KEY: {
    key: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the key parameter must be a string.`,
      toLowerCase: true,
      optional: true,
    },
  },
  FILE_ID: {
    fileId: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the fileId parameter must be a string.`,
      optional: true,
    },
  },
  SHOW_CONTESTED: {
    showContested: {
      in: 'query',
      isBoolean: true,
      toBoolean: true,
      errorMessage: `Value of the showContested parameter must be a boolean.`,
      optional: true,
    },
  },
  SHOW_FORWARD: {
    showForward: {
      in: 'query',
      isBoolean: true,
      toBoolean: true,
      errorMessage: `Value of the showForward parameter must be a boolean.`,
      optional: true,
    },
  },
  BATCH_SIZE: {
    batch_size: {
      in: 'query',
      isInt: {
        options: {
          min: 1,
          max: 1000,
        },
      },
      toInt: true,
      errorMessage: `Value of the batch_size parameter must be an integer between 1 and 1000.`,
      optional: true,
    },
  },
  BATCH: {
    batch: {
      in: 'query',
      isInt: {
        options: {
          min: 0,
        },
      },
      toInt: true,
      errorMessage: `Value of the batch parameter must be an integer greater or equal than 0.`,
      optional: false,
    },
  },
  ABRIDGED: {
    abridged: {
      in: 'query',
      isBoolean: true,
      toBoolean: true,
      errorMessage: `Value of the abridged parameter must be a boolean.`,
      optional: true,
    },
  },
  WITH_FILE_OF_TYPE: {
    withFileOfType: {
      in: 'query',
      toArray: true,
    },
    'withFileOfType.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.filetype.options],
      },
      errorMessage: `Value(s) of the withFileOfType parameter must be in [${taxons.all.filetype.keys}].`,
      optional: true,
    },
    'legacy.*': {
      in: 'query',
      optional: true,
    },
  },
  SEARCH_AFTER: {
    searchAfter: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the searchAfter parameter must be a string.`,
      optional: true,
    },
  },
  FIELD: {
    field: {
      in: 'query',
      toArray: true,
    },
    'field.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.field.options],
      },
      errorMessage: `Value of the field parameter must be in [${taxons.all.field.keys}].`,
      optional: true,
    },
  },
  SORT: {
    sort: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.sort.options],
      },
      errorMessage: `Value of the sort parameter must be in [${taxons.all.sort.keys}].`,
      optional: true,
    },
  },
  PAGE: {
    page: {
      in: 'query',
      isInt: {
        options: {
          min: 0,
        },
      },
      toInt: true,
      errorMessage: `Value of the page parameter must be an integer greater or equal than 0.`,
      optional: true,
    },
  },
  VALUE: {
    value: {
      in: 'query',
      isString: true,
      errorMessage: `Value parameter must be a string.`,
      optional: true,
    },
  },
  CONTEXT_VALUE: {
    context_value: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the context_value parameter must be a string.`,
      toLowerCase: true,
      optional: true,
    },
  },
  DATE: {
    date: {
      in: 'query',
      isString: true,
      isISO8601: true,
      errorMessage: `Start date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).`,
      optional: false,
    },
  },
  FROM_ID: {
    from_id: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the from_id parameter must be a specific id.`,
      optional: true,
    },
  },
};

module.exports = { VALIDATORS };
