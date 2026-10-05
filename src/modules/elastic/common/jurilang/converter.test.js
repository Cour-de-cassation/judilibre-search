const { convertJurilangToEs } = require("./converter")

describe("src/modules/elastic/search/jurilang/converter", () => {
    describe("convertJurilangToEs", () => {
        it("should work on articles", () => {
            const query = { matchers: ['article', '3111-12'], operator: 'PROX', slop: 2 }
            const result = convertJurilangToEs(query)
            expect(result).toEqual({
                intervals: {
                    text: {
                        all_of: {
                            intervals: [
                                { match: { query: 'article', max_gaps: 0, ordered: true } },
                                { match: { query: '3111-12', max_gaps: 0, ordered: true } }
                            ],
                            max_gaps: 2,
                            ordered: true
                        }
                    }
                }
            })
        })
        it("should search all on empty", () => {
            const query = {}
            const result = convertJurilangToEs(query)
            expect(result).toEqual({ match_all: {} })
        })

    })
})
