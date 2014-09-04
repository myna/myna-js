# log         = require '../../main/common/log'
# BasicClient = require '../../main/client/basic'

# describe "BasicClient", ->
#   beforeEach ->
#     @basic = new BasicClient()
#     @expt  = {
#       uuid:     "uuid"
#       id:       "id"
#       settings: myna: web: sticky: true
#       variants: [
#         { typename: "variant", id: "a", settings: { buttons: "red"   }, weight: 0.2 }
#         { typename: "variant", id: "b", settings: { buttons: "green" }, weight: 0.4 }
#         { typename: "variant", id: "c", settings: { buttons: "blue"  }, weight: 0.6 }
#       ]
#     }
#     return

#   describe "_totalWeight", ->
#     it "should return the sum of the variants' weights", ->
#       expect(@basic._totalWeight(@expt)).toBeCloseTo(1.2, 0.001)

#       @expt.variants[2].weight = 0.0
#       expect(@basic._totalWeight(@expt)).toBeCloseTo(0.6, 0.001)

#   describe "_lookupVariant", ->
#     it "should find a variant by id", (done) ->
#       @basic._lookupVariant(@expt, "b").then (variant) ->
#         log.debug("Found variant", variant)
#         expect(variant.id).toEqual("b")
#         done()

#     it "should find a variant by object", (done) ->
#       @basic._lookupVariant(@expt, @expt.variants[1]).then (variant) ->
#         expect(variant.id).toEqual("b")
#         done()

#     it "should fail gracefully if variantOrId is null", (done) ->
#       @basic._lookupVariant(@expt, "e").then(-> @fail()).catch(-> done())

#   describe "suggest", ->
#     it "should return variants", (done) ->
#       @basic.suggest(@expt).then (variant) ->
#         expect(variant.typename).toEqual("variant")
#         done()

#     it "should return all variants over time", ->
#       iterate = (times, ids = []) =>
#         if times > 0
#           @basic.suggest(@expt).then (variant) ->
#             iterate(times - 1, ids.concat [ variant.id ])
#         else
#           Promise.resolve(ids)

#       iterate(100).then (ids) ->
#         expect(ids).toContain("a")
#         expect(ids).toContain("b")
#         expect(ids).toContain("c")
#         done()

#     it "should skew in favour of the most popular variants", ->
#       @expt.variants[0].weight = 0.0
#       @expt.variants[1].weight = 0.0

#       iterate = (times, ids = []) =>
#         if times > 0
#           @basic.suggest(@expt).then (variant) ->
#             iterate(times - 1, ids.concat [ variant.id ])
#         else
#           Promise.resolve(ids)

#       iterate(100).then (ids) ->
#         expect(ids).not.toContain("a")
#         expect(ids).not.toContain("b")
#         expect(ids).toContain("c")
#         done()

#   describe "view", ->
#     it "should find a variant by id", (done) ->
#       @basic.view(@expt, "b").then (variant) ->
#         log.debug("Found variant", variant)
#         expect(variant.id).toEqual("b")
#         done()

#     it "should find a variant by object", (done) ->
#       @basic.view(@expt, @expt.variants[1]).then (variant) ->
#         expect(variant.id).toEqual("b")
#         done()

#     it "should fail gracefully if variantOrId is null", (done) ->
#       @basic.view(@expt, "e").then(-> @fail()).catch(-> done())

#   describe "reward", ->
#     it "should find a variant by id", (done) ->
#       @basic.reward(@expt, "b").then (variant) ->
#         log.debug("Found variant", variant)
#         expect(variant.id).toEqual("b")
#         done()

#     it "should find a variant by object", (done) ->
#       @basic.reward(@expt, @expt.variants[1]).then (variant) ->
#         expect(variant.id).toEqual("b")
#         done()

#     it "should fail gracefully if variantOrId is null", (done) ->
#       @basic.reward(@expt, "e").then(-> @fail()).catch(-> done())
