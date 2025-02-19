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
  const gteFilter = query.date_start ? new Date(query.date_start) : null
  const lteFilter = query.date_end ? new Date(query.date_end) : null

  const dateFilter = (gteFilter || lteFilter) ? [{ range: { decision_date: { gte: gteFilter, lte: lteFilter } } }] : []
  const jurisdictionFilter = query.jurisdiction ? [{ term: { 'jurisdiction': query.jurisdiction } }] : []
  const locationFilter = query.location ? [{ terms: { 'location.keyword': query.location.split(',') } }] : []

  const filters = [...dateFilter, ...jurisdictionFilter, ...locationFilter]


  elasticAggregationQuery.query.bool.filter = filters
  elasticCountQuery.query.bool.filter = filters

  const DATE_FORMAT = { 'year': 'yyyy', 'month': 'yyy-MM' }

  const aggregationSources = query.keys?.split(',').map(key => {
    if (key !== 'month' && key !== 'year') return { [key]: { terms: { field: (key == 'location') ? `${key}.keyword` : `${key}` } } }

    return {
      year: {
        date_histogram: {
          field: "decision_date",
          calendar_interval: key,
          format: DATE_FORMAT[key]
        }
      }
    }
  }) ?? []

  if (aggregationSources.length > 0) {
    elasticAggregationQuery.aggs.decisions_count = {
      composite: {
        size: 10000,
        sources: aggregationSources
      }
    }
  }


  const { body: { count: elasticCount } } = await this.client.count(
    {
      index: process.env.ELASTIC_INDEX,
      body: elasticCountQuery,
    }
  )


  const { body: { aggregations: elasticAggregations } } = await this.client.search(
    {
      index: process.env.ELASTIC_INDEX,
      body: elasticAggregationQuery,
    }
  )

  response = {
    query: query,
    results: {},
  }

  if (elasticAggregations.decisions_count) {
    response.results.aggregated_data = elasticAggregations.decisions_count.buckets.map(
      (obj) => ({ key: obj.key, decisions_count: obj.doc_count })
    );
  }

  response.results.min_decision_date = elasticAggregations.min_date.value_as_string;
  response.results.max_decision_date = elasticAggregations.max_date.value_as_string;
  response.results.total_decisisions = elasticCount;

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
    response.results.aggregated_data = buckets
  }

  return response;
}

module.exports = stats;
