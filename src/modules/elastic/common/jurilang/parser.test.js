const { 
    splitQuerystring, 
    cleanCaracters, 
    cleanOperators, 
    priorizeProx, 
    priorizeEt, 
    priorize, 
    parseQuerysplitPriorized, 
    parseQuerystring 
} = require("./parser")

describe("src/modules/elastic/search/jurilang/parser", () => {
    describe("splitQuerystring", () => {
        it("should split a query string", () => {
            const querystring = "hello world"
            const result = splitQuerystring(querystring)
            expect(result).toEqual(["hello", " ", "world"])
        })

        it("should split a query string with operators", () => {
            const querystring = "hello world SAUF birds"
            const result = splitQuerystring(querystring)
            expect(result).toEqual(["hello", " ", "world", " ", "SAUF", " ", "birds"])
        })

        it("should split a query string with exact expression", () => {
            const querystring = '"hello world" SAUF birds'
            const result = splitQuerystring(querystring)
            expect(result).toEqual(['"hello world"', ' ', 'SAUF', ' ', 'birds'])
        })

        it("should split a query string with substrings", () => {
            const querystring = '"hello world" ET ("hi moon" OU "good morning england")'
            const result = splitQuerystring(querystring)
            expect(result).toEqual(['"hello world"', ' ', 'ET', ' ', ['(', '"hi moon"', ' ', 'OU', ' ', '"good morning england"', ')']])
        })
    })

    describe("cleanCaracters", () => {
        it("should clean a query splitted", () => {
            const querysplit = ["hello", " ", "world"]
            const result = cleanCaracters(querysplit)
            expect(result).toEqual(["hello", "world"])
        })

        it("should clean a query splitted with bad caracters", () => {
            const querysplit = ["hello", "é ", "world"]
            const result = cleanCaracters(querysplit)
            expect(result).toEqual(["hello", "world"])
        })

        it("should clean a query splitted with subquery", () => {
            const querysplit = ['"hello world"', ' ', 'ET', ' ', ['(', '"hi moon"', ' ', 'OU', ' ', '"good morning england"', ')']]
            const result = cleanCaracters(querysplit)
            expect(result).toEqual(['hello world', 'ET', ['hi moon', 'OU', 'good morning england']])
        })
    })

    describe("cleanOperators", () => {
        it("should throw an error if begin by operator", () => {
            const querysplit1 = ['ET', '"hello world"']
            const querysplit2 = ['OU', '"hello world"']
            const querysplit3 = ['SAUF', '"hello world"']
            const querysplit4 = ['PROX/5', '"hello world"']
            const result1 = () => cleanOperators(querysplit1)
            const result2 = () => cleanOperators(querysplit2)
            const result3 = () => cleanOperators(querysplit3)
            const result4 = () => cleanOperators(querysplit4)
            expect(result1).toThrow()
            expect(result2).toThrow()
            expect(result3).toThrow()
            expect(result4).toThrow()
        })

        it("should throw an error if end by operator", () => {
            const querysplit1 = ['"hello world"', 'ET']
            const querysplit2 = ['"hello world"', 'OU']
            const querysplit3 = ['"hello world"', 'SAUF']
            const querysplit4 = ['"hello world"', 'PROX/5']
            const result1 = () => cleanOperators(querysplit1)
            const result2 = () => cleanOperators(querysplit2)
            const result3 = () => cleanOperators(querysplit3)
            const result4 = () => cleanOperators(querysplit4)
            expect(result1).toThrow()
            expect(result2).toThrow()
            expect(result3).toThrow()
            expect(result4).toThrow()
        })

        it("should throw an error if operator followed by operator", () => {
            const querysplit = ['"hello world"', 'ET', 'OU', 'ET', 'OU', 'moon']
            const result = () => cleanOperators(querysplit)
            expect(result).toThrow()
        })

        it("should add a OU if an operator missing", () => {
            const querysplit1 = ['"hello world"', 'moon']
            const querysplit2 = ['"hello world"', 'ET', 'moon', 'light']
            const result1 = cleanOperators(querysplit1)
            const result2 = cleanOperators(querysplit2)
            expect(result1).toEqual(['"hello world"', 'OU', 'moon'])
            expect(result2).toEqual(['"hello world"', 'ET', 'moon', 'OU', 'light'])
        })

        it("should be recursive", () => {
            const querysplit = ['"hello world"', ['hello', 'moon']]
            const result = cleanOperators(querysplit)
            expect(result).toEqual(["\"hello world\"", "OU", ["hello", "OU", "moon"]])
        })
    })

    describe("priorizeProx", () => {
        it("should isolate PROX in a flat query", () => {
            const querysplit = ['hello', 'OU', 'jupiter', 'ET', '"hello world"', 'PROX/5', 'moon']
            const result = priorizeProx(querysplit)
            expect(result).toEqual(['hello', 'OU', 'jupiter', 'ET', ['"hello world"', 'PROX/5', 'moon']])
        })
        it("should be recursive", () => {
            const querysplit = ['hello', 'OU', ['jupiter', 'ET', '"hello world"', 'PROX/5', 'moon']]
            const result = priorizeProx(querysplit)
            expect(result).toEqual(['hello', 'OU', ['jupiter', 'ET', ['"hello world"', 'PROX/5', 'moon']]])
        })
    })

    describe("priorizeEt", () => {
        it("should isolate ET in a flat query", () => {
            const querysplit = ['hello', 'OU', 'jupiter', 'ET', '"hello world"', 'OU', 'moon']
            const result = priorizeEt(querysplit)
            expect(result).toEqual(['hello', 'OU', ['jupiter', 'ET', '"hello world"'], 'OU', 'moon'])
        })
        it("should be recursive", () => {
            const querysplit = ['hello', 'OU', ['jupiter', 'ET', '"hello world"', 'OU', 'moon']]
            const result = priorizeEt(querysplit)
            expect(result).toEqual(['hello', 'OU', [['jupiter', 'ET', '"hello world"'], 'OU', 'moon']])
        })
        it("should associate some ET in a flat query", () => {
            const querysplit = ['hello', 'OU', 'jupiter', 'ET', '"hello world"', 'ET', 'moon', 'OU', 'mars']
            const result = priorizeEt(querysplit)
            expect(result).toEqual(['hello', 'OU', ['jupiter', 'ET', '"hello world"', 'ET', 'moon'], 'OU', 'mars'])
        })
        it("should associate some ET and SAUF in a flat query", () => {
            const querysplit = ['hello', 'OU', 'jupiter', 'ET', '"hello world"', 'ET', 'moon', 'SAUF', 'iss', 'OU', 'mars']
            const result = priorizeEt(querysplit)
            expect(result).toEqual(['hello', 'OU', ['jupiter', 'ET', '"hello world"', 'ET', 'moon', 'SAUF', 'iss'], 'OU', 'mars'])
        })
    })

    describe("priorize", () => {
        it("should priorize in a query", () => {
            const querysplit = ['aa', 'ET', 'bb', 'SAUF', 'cc', 'ET', ['dd', 'PROX/5', 'ee', 'OU', 'ff'], 'OU', 'gg', 'OU', 'hh', 'ET', 'jj']
            const result = priorize(querysplit)
            expect(result).toEqual([['aa', 'ET', 'bb', 'SAUF', 'cc', 'ET', [['dd', 'PROX/5', 'ee'], 'OU', 'ff']], 'OU', 'gg', 'OU', ['hh', 'ET', 'jj']])
        })
    })

    describe("parseQuerysplitPriorized", () => {
        it("should parse a query", () => {
            const querysplit = [['aa', 'ET', 'bb', 'SAUF', 'cc', 'ET', [['dd', 'PROX/5', 'ee'], 'OU', 'ff']], 'OU', 'gg', 'OU', ['hh', 'ET', 'jj']]
            const result = parseQuerysplitPriorized(querysplit)
            expect(result).toEqual({
                "matchers": [
                    {
                        "matchers": [
                            "aa",
                            "bb",
                            {
                                "matchers": [
                                    {
                                        "matchers": [
                                            "dd",
                                            "ee"
                                        ],
                                        "operator": "PROX",
                                        "slop": 5
                                    },
                                    "ff"
                                ],
                                "operator": "OU"
                            }
                        ],
                        "not_matchers": ["cc"],
                        "operator": "ET"
                    },
                    "gg",
                    { "matchers": ["hh", "jj"], "operator": "ET" }],
                "operator": "OU"
            })
        })
    })

    describe("parseQuerystring", () => {
        it("should parse one word", () => {
            const querystring = '"hello world"'
            const result = parseQuerystring(querystring)
            expect(result).toEqual({ query: { "matchers": ["hello world"] }, querystring: "hello world" })
        })

        it("should parse with implicit OR and priorization", () => {
            const querystring = "hello world SAUF birds"
            const result = parseQuerystring(querystring)
            expect(result).toEqual({ 
                query: { 
                    "matchers": ["hello", { "matchers": ["world"], "not_matchers": ["birds"], "operator": "ET" }], 
                    "operator": "OU" 
                }, 
                querystring: "hello OU (world SAUF birds)" 
            })
        })

        it("should parse a with substring and complex priorization", () => {
            const querystring = 'aa ET bb SAUF cc OU dd ET (ee OU ff) ET gg PROX/5 hh'
            const result = parseQuerystring(querystring)
            expect(result).toEqual({
                query: {
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
                },
                querystring: "(aa ET bb SAUF cc) OU (dd ET (ee OU ff) ET (gg PROX/5 hh))"
            })
        })
    })
})
