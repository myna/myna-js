log          = require '../../main/common/log'
CachedClient = require '../../main/client/cached'

describe "CachedClient", ->
  beforeEach ->
    @cached = new CachedClient()
    @expt  = {
      uuid:     "uuid"
      id:       "id"
      settings: myna: web: sticky: true
      variants: [
        { typename: "variant", id: "a", settings: { buttons: "red"   }, weight: 0.2 }
        { typename: "variant", id: "b", settings: { buttons: "green" }, weight: 0.4 }
        { typename: "variant", id: "c", settings: { buttons: "blue"  }, weight: 0.6 }
      ]
    }
    @cached.clear(@expt)
    return

  describe "suggest", ->
    it "should return variants", (done) ->
      @cached.suggest(@expt).then (variant) =>
        expect(variant.typename).toEqual("variant")
        done()

    it "should return all variants over time", ->
      iterate = (times, ids = []) =>
        if times > 0
          @cached.suggest(@expt).then (variant) =>
            iterate(times - 1, ids.concat [ variant.id ])
        else
          Promise.resolve(ids)

      iterate(100).then (ids) =>
        expect(ids).toContain("a")
        expect(ids).toContain("b")
        expect(ids).toContain("c")
        done()

    it "should skew in favour of the most popular variants", ->
      @expt.variants[0].weight = 0.0
      @expt.variants[1].weight = 0.0

      iterate = (times, ids = []) =>
        if times > 0
          @cached.suggest(@expt).then (variant) =>
            iterate(times - 1, ids.concat [ variant.id ])
        else
          Promise.resolve(ids)

      iterate(100).then (ids) =>
        expect(ids).not.toContain("a")
        expect(ids).not.toContain("b")
        expect(ids).toContain("c")
        done()

  describe "view", ->
    it "should find a variant by id", (done) ->
      @cached.view(@expt, "b").then (variant) =>
        expect(variant.id).toEqual("b")
        done()

    it "should find a variant by object", (done) ->
      @cached.view(@expt, @expt.variants[1]).then (variant) =>
        expect(variant.id).toEqual("b")
        done()

    it "should fail gracefully if variantOrId is null", (done) ->
      @cached.view(@expt, "e").then(=> @fail()).catch(=> done())

  describe "reward", ->
    it "should reward the last suggested variant", (done) ->
      @cached.suggest(@expt).then (viewed) =>
        console.log("suggest viewed", viewed)
        @cached.reward(@expt).then (rewarded) =>
          console.log("suggest rewarded", rewarded)
          expect(viewed).toEqual(rewarded)
          done()

    it "should reward the last viewed variant", (done) ->
      @cached.view(@expt, "b").then (viewed) =>
        console.log("view viewed", viewed)
        @cached.reward(@expt).then (rewarded) =>
          console.log("view rewarded", rewarded)
          expect(viewed).toEqual(rewarded)
          expect(viewed.id).toEqual("b")
          done()

    it "should fail if no variant was suggested", (done) ->
      @cached.reward(@expt).catch (error) =>
        done()
