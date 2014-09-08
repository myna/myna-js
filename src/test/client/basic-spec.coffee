Promise     = require('es6-promise').Promise
BasicClient = require '../../main/client/basic'

describe "BasicClient", ->
  beforeEach ->
    @client = new BasicClient()
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

  describe "suggest", ->
    it "should return variants", (done) ->
      @client.suggest(@expt).then (variant) =>
        expect(variant.typename).toEqual("variant")
        done()

    it "should return all variants over time", (done) ->
      iterate = (times, ids = []) =>
        if times > 0
          @client.suggest(@expt).then (variant) ->
            iterate(times - 1, ids.concat [ variant.id ])
        else
          Promise.resolve(ids)

      iterate(100).then (ids) ->
        expect(ids).toContain("a")
        expect(ids).toContain("b")
        expect(ids).toContain("c")
        done()

    it "should skew in favour of the most popular variants", (done) ->
      @expt.variants[0].weight = 0.0
      @expt.variants[1].weight = 0.0

      iterate = (times, ids = []) =>
        if times > 0
          @client.suggest(@expt).then (variant) =>
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
      @client.view(@expt, "b").then (variant) =>
        expect(variant.id).toEqual("b")
        done()

    it "should find a variant by object", (done) ->
      @client.view(@expt, @expt.variants[1]).then (variant) =>
        expect(variant.id).toEqual("b")
        done()

    it "should fail gracefully if variantOrId is null", (done) ->
      @client.view(@expt, "e").then(=> @fail()).catch(=> done())

  describe "reward", ->
    it "should find a variant by id", (done) ->
      @client.reward(@expt, "b").then (variant) =>
        expect(variant.id).toEqual("b")
        done()

    it "should find a variant by object", (done) ->
      @client.reward(@expt, @expt.variants[1]).then (variant) =>
        expect(variant.id).toEqual("b")
        done()

    it "should fail gracefully if variantOrId is null", (done) ->
      @client.reward(@expt, "e").then(=> @fail()).catch(=> done())
