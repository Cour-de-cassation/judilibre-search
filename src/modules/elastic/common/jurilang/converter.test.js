const { convertJurilangToEs } = require("./converter")

describe("src/modules/elastic/search/jurilang/converter", () => {
    describe("convertJurilangToEs", () => {
        it("should", () => {
            const query = { query: { "matchers": ["contrat de travail", "Paris"], operator: "ET" }, querystring: "contrat de travail ET Paris" }
            const result = convertJurilangToEs(query.query)
            expect(result).toEqual({"query": {"bool": {"must": [{"span_near": {"clauses": [{"span_term": {"text": "contrat"}}, {"span_term": {"text": "de"}}, {"span_term": {"text": "travail"}}], "in_order": true, "slop": 0}}, {"match": {"text": "Paris"}}], "must_not": []}}})
        })
    })
})
