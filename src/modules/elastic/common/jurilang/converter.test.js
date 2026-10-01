const { convertJurilangToEs } = require("./converter")

describe("src/modules/elastic/search/jurilang/converter", () => {
    describe("convertJurilangToEs", () => {
        it("should", () => {
            const query = { matchers: ['article', '3111-12'], operator: 'PROX', slop: 2 }
            const result = convertJurilangToEs(query)
            console.dir(result, { depth: null })
            expect(result).toEqual({
                query: {
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
                }
            })
        })
    })
})
