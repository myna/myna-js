variant = require '../../main/client/variant'

describe "variant", ->
  beforeEach ->
    @expt = {
      uuid:     "uuid"
      id:       "id"
      settings: myna: web: sticky: true
      variants: [
        { typename: "variant", id: "a", settings: { buttons: "red"   }, weight: 0.2 }
        { typename: "variant", id: "b", settings: { buttons: "green" }, weight: 0.4 }
        { typename: "variant", id: "c", settings: { buttons: "blue"  }, weight: 0.6 }
      ]
    }
    return

  describe "random", ->
    it "should return variants", ->
      ans = variant.random(@expt)
      expect(ans.typename).toEqual("variant")
      return

    it "should return all variants over time", ->
      ids = []
      for i in [1..100]
        ans = variant.random(@expt)
        ids.push(ans.id)

      expect(ids).toContain("a")
      expect(ids).toContain("b")
      expect(ids).toContain("c")
      return

    it "should skew in favour of the most popular variants", ->
      @expt.variants[0].weight = 0.0
      @expt.variants[1].weight = 0.0

      ids = []
      for i in [1..100]
        ans = variant.random(@expt)
        ids.push(ans.id)

      expect(ids).not.toContain("a")
      expect(ids).not.toContain("b")
      expect(ids).toContain("c")
      return

  describe "lookup", ->
    it "should find a variant by id", ->
      ans = variant.lookup(@expt, "b")
      expect(ans.id).toEqual("b")
      return

    it "should find a variant by object", ->
      ans = variant.lookup(@expt, @expt.variants[1])
      expect(ans.id).toEqual("b")
      return

    it "should fail gracefully if variant is not found", ->
      ans = variant.lookup(@expt, "e")
      expect(ans).toEqual(null)
      return
