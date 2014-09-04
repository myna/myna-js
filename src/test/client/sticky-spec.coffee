log         = require '../../main/common/log'
StickyCache = require '../../main/client/sticky'

describe "StickyCache", ->
  beforeEach ->
    @sticky = new StickyCache()
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

  describe "loadView", ->
    it "should fail by default", ->
      variant = @sticky.loadView(@expt)
      expect(variant).toEqual(null)
      return

    it "should return a view once saved", ->
      @sticky.saveView(@expt, @expt.variants[1])
      variant = @sticky.loadView(@expt)
      expect(variant).toEqual(@expt.variants[1])
      return

    it "should fail after a call to clear()", ->
      @sticky.saveView(@expt, @expt.variants[1])
      expect(@sticky.loadView(@expt)).toEqual(@expt.variants[1])
      @sticky.clear(@expt)
      expect(@sticky.loadView(@expt)).toEqual(null)
      return

  describe "loadReward", ->
    it "should fail by default", ->
      variant = @sticky.loadReward(@expt)
      expect(variant).toEqual(null)
      return

    it "should return a view once saved", ->
      @sticky.saveReward(@expt, @expt.variants[1])
      variant = @sticky.loadReward(@expt)
      expect(variant).toEqual(@expt.variants[1])
      return

    it "should fail after a call to clear()", ->
      @sticky.saveReward(@expt, @expt.variants[1])
      expect(@sticky.loadReward(@expt)).toEqual(@expt.variants[1])
      @sticky.clear(@expt)
      expect(@sticky.loadReward(@expt)).toEqual(null)
      return
