require('../env');

async function stats(query) {
  if (process.env.WITHOUT_ELASTIC) {
    return statsWithoutElastic.apply(this, [query]);
  }

  let response = {
    indexedTotal: 0,
    requestPerDay: 0, // @TODO
    requestPerWeek: 0, // @TODO
    requestPerMonth: 0, // @TODO
    oldestDecision: null,
    newestDecision: null,
    indexedByJurisdiction: [], // @TODO
    indexedByYear: [], // @TODO
  };

  let statsData = await this.client.count({
    index: process.env.ELASTIC_INDEX,
  });

  if (statsData && statsData.body && statsData.body.count) {
    response.indexedTotal = statsData.body.count;
  }

  let statsCCData = await this.client.count({
    index: process.env.ELASTIC_INDEX,
    body: {
      query: {
        function_score: {
          query: {
            bool: {
              filter: [
                {
                  terms: {
                    jurisdiction: 'cc',
                  },
                },
              ],
            },
          },
        },
      },
    },
  });

  if (statsCCData && statsCCData.body && statsCCData.body.count) {
    response.indexedByJurisdiction.push({
      label: 'Cour de cassation',
      value: statsCCData.body.count,
    });
  }

  let statsCAData = await this.client.count({
    index: process.env.ELASTIC_INDEX,
    body: {
      query: {
        function_score: {
          query: {
            bool: {
              filter: [
                {
                  terms: {
                    jurisdiction: 'ca',
                  },
                },
              ],
            },
          },
        },
      },
    },
  });

  if (statsCAData && statsCAData.body && statsCAData.body.count) {
    response.indexedByJurisdiction.push({
      label: "Cours d'appel",
      value: statsCAData.body.count,
    });
  }

  let content = await this.client.search({
    index: process.env.ELASTIC_INDEX,
    size: 0,
    body: {
      aggs: {
        min_date: {
          min: {
            field: 'decision_date',
            format: 'yyyy-MM-dd',
          },
        },
        max_date: {
          max: {
            field: 'decision_date',
            format: 'yyyy-MM-dd',
          },
        },
      },
    },
  });

  if (content && content.body && content.body.aggregations) {
    response.oldestDecision = content.body.aggregations.min_date.value_as_string;
    response.newestDecision = content.body.aggregations.max_date.value_as_string;
  }

  return response;
}

function statsWithoutElastic(query) {
  let response = {
    requestPerDay: 0,
    requestPerWeek: 0,
    requestPerMonth: 0,
    indexedTotal: 0,
    oldestDecision: '1800-01-01',
    newestDecision: '2021-01-01',
    indexedByJurisdiction: [
      {
        value: 1500000,
        label: 'Cour de cassation',
      },
      {
        value: 135000,
        label: "Cour d'appel de Paris",
      },
    ],
    indexedByYear: [
      {
        value: 250000,
        label: '2019',
      },
      {
        value: 195000,
        label: '2018',
      },
    ],
  };

  return response;
}

module.exports = stats;
