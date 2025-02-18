require('../env');

async function stats(query) {
  if (process.env.WITHOUT_ELASTIC) {
    return statsWithoutElastic.apply(this, [query]);
  }

  // initialisation de la requête
  let elasticAggregationQuery = {
    size: 0,
    query: {
      bool: {
        filter: []
      }
    },
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
      }
    }
  };

  let elasticCountQuery = {
    query: {
      bool: {
        filter: []
      }
    }
  };

  // gestion des filtres
  let filters = []
  if (query.date_start || query.date_end) {
    filters.push(
      {
        range: {
          decision_date: {
            gte: query.date_start ? new Date(query.date_start) : null,
            lte: query.date_end ? new Date(query.date_end) : null
          }
        }
      }
    )
  }
  if (query.jurisdiction) {
    filters.push({ term: { jurisdiction: query.jurisdiction } })
  }

  elasticAggregationQuery.query.bool.filter = filters
  elasticCountQuery.query.bool.filter = filters

  let aggregationSources = [];
  // gestion des clefs d'agregation
  if (query.keys) {
    for (var key of query.keys.split(',')) {
      if (key === 'year') {
        aggregationSources.push(
          {
            year: {
              date_histogram: {
                field: "decision_date",
                calendar_interval: "year",
                format: "yyyy",
              }
            }
          }
        )
      } else if (key === 'month') {
        aggregationSources.push(
          {
            year: {
              date_histogram: {
                field: "decision_date",
                calendar_interval: "month",
                format: "yyyy-MM",
              }
            }
          }
        )
      } else {
        aggregationSources.push({ [key]: { terms: { field: `${key}.keyword` } } })
      }
    }
  }

  if (aggregationSources.length > 0) {
    elasticAggregationQuery.aggs.decisions_count = {
      composite: {
        size: 10000,
        sources: aggregationSources
      }
    }
  }


  let elasticCountResults = await this.client.count(
    {
      index: process.env.ELASTIC_INDEX,
      body: elasticCountQuery,
    }

  )


  let elasticAggregationResults = await this.client.search(
    {
      index: process.env.ELASTIC_INDEX,
      body: elasticAggregationQuery,
    }
  )

  response = {
    query: query,
    // elasticAggregationQuery: elasticAggregationQuery,
    // elasticCountQuery: elasticCountQuery,
    // elasticAggregationResults: elasticAggregationResults,
    // elasticCountResults: elasticCountResults,
    results: {},
  }

  if (elasticAggregationResults.body.aggregations.decisions_count) {
    response.results.aggregated_data = elasticAggregationResults.body.aggregations.decisions_count.buckets.map(
      (obj) => ({ key: obj.key, decisions_count: obj.doc_count })
    );
  }

  response.results.min_decision_date = elasticAggregationResults.body.aggregations.min_date.value_as_string;
  response.results.max_decision_date = elasticAggregationResults.body.aggregations.max_date.value_as_string;
  response.results.total_decisisions = elasticCountResults.body.count;

  return response;
}


function statsWithoutElastic(query) {
  let response = {
    query: query,
    results: {
      total_decisions: 123456,
      min_decision_date: "1970-10-01",
      max_decision_date: "2025-02-18",
    }
  }

  if (query.keys) {
    let buckets = [];
    for (var i = 0; i < 5; i++) {
      let bucketKey = {}
      for (var k of query.keys.split(',')) {
        bucketKey[k] = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      }
      buckets.push(
        {
          key: bucketKey,
          decisions_count: Math.floor(Math.random() * 1000)
        }
      )
    }
    response.results.aggregated_date = buckets
  }

  return response;
}

module.exports = stats;
