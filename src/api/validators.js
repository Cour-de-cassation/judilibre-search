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
];
const ALL_LOCATIONS = [...taxons.ca.location.keys, ...taxons.tj.location.keys, ...taxons.tcom.location.keys]
const ALL_JURISDICTIONS = [...taxons.all.jurisdiction.keys]


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
        }
    },
    DATE_END: {
        date_end: {
            in: 'query',
            isString: true,
            isISO8601: true,
            errorMessage: `End date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).`,
            optional: true,
        }
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
        }
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
        }
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
        }
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

};

module.exports = { VALIDATORS }