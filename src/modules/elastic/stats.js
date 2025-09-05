require('../env');
const { filterByDate, filterByJurisdiction, filterByLocation, filterByParticularInterest, buildFilter } = require("./scan/query")

const DATE_FORMAT = { 'year': 'yyyy', 'month': 'yyy-MM' }


function buildAggregationQuery({ query }) {

  // console.log("FILTER")
  // console.log(JSON.stringify(buildFilter(
  //   query,
  //   filterByDate,
  //   filterByJurisdiction,
  //   filterByLocation,
  //   filterByParticularInterest
  // )))

  const aggregationKeys = query.keys?.map(key => {
    if (key !== 'month' && key !== 'year') return { [key]: { terms: { field: (key == 'location') ? `${key}.keyword` : `${key}` } } }

    return {
      [key]: {
        date_histogram: {
          field: "decision_date",
          calendar_interval: key,
          format: DATE_FORMAT[key]
        }
      }
    }
  }) ?? []

  let elasticAggregationQuery = {
    size: 0,
    query: {
      bool: {
        filter: buildFilter(
          query,
          filterByDate,
          filterByJurisdiction,
          filterByLocation,
          filterByParticularInterest
        )
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
      },
      ...(
        aggregationKeys.length > 0
          ? {
            decisions_count: {
              composite: {
                size: 10000,
                sources: aggregationKeys
              }
            }
          }
          : {}
      )
    }
  };
  return { elasticAggregationQuery }
}


function buildCountQuery({ query }) {
  let elasticCountQuery = {
    query: {
      bool: {
        filter: buildFilter(
          query,
          filterByDate,
          filterByJurisdiction,
          filterByLocation,
          filterByParticularInterest
        )
      }
    }
  };
  // console.log("COUNT QUERY")
  // console.log(JSON.stringify(elasticCountQuery))
  return { elasticCountQuery }
}





function fetchStatsWithoutElastic({ query }) {

  const { elasticAggregationQuery } = buildAggregationQuery({ query });
  const { elasticCountQuery } = buildCountQuery({ query });
  console.log("COUNT QUERY")
  console.log(JSON.stringify(elasticCountQuery, null, 4))
  console.log("---")
  console.log("AGGREGATION QUERY")
  console.log(JSON.stringify(elasticAggregationQuery, null, 4))
  console.log("---")

  const rawCountResult = { body: { count: 123456 } }
  const rawAggregationResult = {
    body: {
      aggregations: {
        min_date: "1970-10-01",
        max_date: "2025-02-18",
        ...(
          (query.keys && query.keys.length > 0)
            ? {
              decisions_count: {
                buckets: [...Array(3)].map(
                  (_) => (
                    {
                      doc_count: Math.floor(Math.random() * 1000),
                      key: (
                        query.keys
                          .map((k) => ({ [k]: String.fromCharCode(65 + Math.floor(Math.random() * 26)) })))
                        .reduce((agg, elements) => ({ ...agg, ...elements }), {})
                    }
                  )
                )
              }
            }
            : {}

        )
      }
    }
  }

  return { rawCountResult, rawAggregationResult };
}

async function fetchStats(query) {
  if (process.env.WITHOUT_ELASTIC) {
    const { rawCountResult, rawAggregationResult } = fetchStatsWithoutElastic({ query });
    return formatElasticToStatsResponse(rawCountResult, rawAggregationResult, query)
  }
  else {
    const { elasticCountQuery } = buildCountQuery({ query })
    // console.log(JSON.stringify(elasticCountQuery))
    const rawCountResult = await this.client.count(
      {
        index: process.env.ELASTIC_INDEX,
        body: elasticCountQuery,
      }
    )
    const { elasticAggregationQuery } = buildAggregationQuery({ query })
    const rawAggregationResult = await this.client.search(
      {
        index: process.env.ELASTIC_INDEX,
        body: elasticAggregationQuery,
      }
    )
    return formatElasticToStatsResponse(rawCountResult, rawAggregationResult, query)
  }


}


function formatElasticToStatsResponse(rawCountResult, rawAggregationResult, query) {
  const { body: { count: elasticCount } } = rawCountResult;
  const { body: { aggregations: elasticAggregations } } = rawAggregationResult;
  // console.log("AGGREGATION")
  // console.log(JSON.stringify(elasticAggregations))
  const response = {
    query: query,
    results: {
      ...{
        min_decision_date: (elasticAggregations.min_date.value_as_string) ? elasticAggregations.min_date.value_as_string : elasticAggregations.min_date.value,
        max_decision_date: (elasticAggregations.max_date.value_as_string) ? elasticAggregations.max_date.value_as_string : elasticAggregations.max_date.value,
        total_decisions: elasticCount,
      },
      ...(elasticAggregations.decisions_count ?
        {
          aggregated_data: elasticAggregations.decisions_count.buckets.map(
            (obj) => ({ key: obj.key, decisions_count: obj.doc_count })
          )
        }
        : {}

      )
    }
  }

  return response

}



module.exports = fetchStats;