const { convertJurilangToEs } = require("./converter")

describe("src/modules/elastic/search/jurilang/converter", () => {
    describe("convertJurilangToEs", () => {
        it("should", () => {
            const query = {
                "matchers": [
                    { "matchers": ["aa", "bb"], "not_matchers": ["cc"], "operator": "ET" },
                    {
                        "matchers": [
                            "dd",
                            { "matchers": ["ee", "ff"], "operator": "OU" },
                            { "matchers": ["gg", "hh"], "operator": "PROX", "slop": 5 }
                        ], "operator": "ET"
                    }
                ], "operator": "OU"
            }
            const result = convertJurilangToEs(query)
            console.dir(result, { depth: null })
            expect(result).toEqual({
                query: {
                    bool: {
                        should: [
                            {
                                bool: {
                                    must: [
                                        { match_phrase: { text: 'aa' } },
                                        { match_phrase: { text: 'bb' } }
                                    ],
                                    must_not: [{ match_phrase: { text: 'cc' } }]
                                }
                            },
                            {
                                bool: {
                                    must: [
                                        { match_phrase: { text: 'dd' } },
                                        {
                                            bool: {
                                                should: [
                                                    { match_phrase: { text: 'ee' } },
                                                    { match_phrase: { text: 'ff' } }
                                                ],
                                                minimum_should_match: 1
                                            }
                                        },
                                        {
                                            intervals: {
                                                text: {
                                                    ordered: {
                                                        intervals: [
                                                            { match: { query: 'gg' } },
                                                            { match: { query: 'hh' } }
                                                        ],
                                                        max_gaps: 5
                                                    }
                                                }
                                            }
                                        }
                                    ],
                                    must_not: []
                                }
                            }
                        ],
                        minimum_should_match: 1
                    }
                }
            })
        })
    })
})
