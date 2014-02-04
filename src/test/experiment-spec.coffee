initialized = (fn) ->
  ->
    expt = new Myna.Experiment
      uuid:     "uuid"
      id:       "id"
      settings: "myna.web.sticky": true
      variants: [
        { id: "a", settings: { buttons: "red"   }, weight: 0.2 }
        { id: "b", settings: { buttons: "green" }, weight: 0.4 }
        { id: "c", settings: { buttons: "blue"  }, weight: 0.6 }
      ]
    expt.unstick()
    fn.call(this, expt)

describe "Myna.Experiment.constructor", ->
  it "should accept custom options", initialized (expt) ->
    expect(expt.uuid).toEqual("uuid")
    expect(expt.id).toEqual("id")
    expect(expt.settings.data).toEqual(myna: web: sticky: true)
    expect(for key, value of expt.variants then key).toEqual(["a", "b", "c"])
    expect(for key, value of expt.variants then value.id).toEqual(["a", "b", "c"])
    expect(for key, value of expt.variants then value.settings.data).toEqual([
      { buttons: "red"   }
      { buttons: "green" }
      { buttons: "blue"  }
    ])
    expect(for key, value of expt.variants then value.weight).toEqual([ 0.2, 0.4, 0.6 ])

  it "should succeed if no settings or variants are provided", initialized (expt) ->
    actual = new Myna.Experiment(uuid: "uuid", id: "id")
    expect(actual.settings.data).toEqual({})
    expect(actual.variants).toEqual({})

  it "should fail if no uuid is provided", initialized (expt) ->
    expect(-> new Myna.Experiment(id: "id")).toThrow()

  it "should fail if no id is provided", initialized (expt) ->
    expect(-> new Myna.Experiment(uuid: "uuid")).toThrow()

describe "Myna.Experiment.sticky", ->
  it "should be derived from the 'myna.web.sticky' setting", initialized (expt) ->
    expect(new Myna.Experiment(uuid: "uuid", id: "id", settings: "myna.web.sticky": true).sticky()).toEqual(true)
    expect(new Myna.Experiment(uuid: "uuid", id: "id", settings: "myna.web.sticky": false).sticky()).toEqual(false)

  it "should default to true", initialized (expt) ->
    expect(new Myna.Experiment(uuid: "uuid", id: "id").sticky()).toEqual(true)

describe "Myna.Experiment.totalWeight", ->
  it "should return the sum of the variants' weights, even if they don't total 1.0", initialized (expt) ->
    expect(expt.totalWeight()).toBeCloseTo(1.2, 0.001)

describe "Myna.Experiment.randomVariant", ->
  it "should return ... er ... random variants", initialized (expt) ->
    ids = []
    for i in [1..100]
      actual = expt.randomVariant()
      expect(actual).toBeInstanceOf(Myna.Variant)
      ids.push(actual.id)
    expect(ids).toContain("a")
    expect(ids).toContain("b")
    expect(ids).toContain("c")

  it "should skew in favour of the most popular variants", initialized (expt) ->
    expt.variants.a.weight = 0.0
    expt.variants.c.weight = 0.0
    ids = []
    for i in [1..100]
      ids.push(expt.randomVariant().id)
    expect(ids).not.toContain("a")
    expect(ids).toContain("b")
    expect(ids).not.toContain("c")

for localStorageEnabled in [false, true] # end up resetting it to true
  Myna.cache.localStorageEnabled = localStorageEnabled

  localStorageStatus =
    "localStorage" +
    (if Myna.cache.localStorageSupported then ' supported,' else ' unsupported,') +
    (if Myna.cache.localStorageEnabled then ' enabled' else ' disabled')

  describe "Myna.Experiment.{load,save,clear}LastView (#{localStorageStatus})", ->
    it "should load nothing if nothing has been saved", initialized (expt) ->
      expt.clearLastView()
      expect(expt.loadLastView()).toEqual(null)

    it "should load the last saved suggestion", initialized (expt) ->
      expt.saveLastView(expt.variants.a)
      expect(expt.loadLastView()).toBe(expt.variants.a)

      expt.saveLastView(expt.variants.b)
      expect(expt.loadLastView()).toBe(expt.variants.b)

    it "should not interfere with other experiments", initialized (expt) ->
      expt2 = new Myna.Experiment(uuid: "uuid2", id: "id2")
      expt.saveLastView(expt.variants.a)
      expect(expt2.loadLastView()).toEqual(null)

  describe "Myna.Experiment.{load,save,clear}StickySuggestion (#{localStorageStatus})", ->
    it "should load nothing if nothing has been saved", initialized (expt) ->
      expt.clearStickySuggestion()
      expect(expt.loadStickySuggestion()).toEqual(null)

    it "should load the last saved suggestion", initialized (expt) ->
      expt.saveStickySuggestion(expt.variants.a)
      expect(expt.loadStickySuggestion()).toBe(expt.variants.a)

      expt.saveStickySuggestion(expt.variants.b)
      expect(expt.loadStickySuggestion()).toBe(expt.variants.b)

    it "should not interfere with other experiments", initialized (expt) ->
      expt2 = new Myna.Experiment(uuid: "uuid2", id: "id2")
      expt.saveStickySuggestion(expt.variants.a)
      expect(expt2.loadStickySuggestion()).toEqual(null)

    it "should not interfere with the last suggestion", initialized (expt) ->
      expt.saveLastView(expt.variants.a)
      expt.saveStickySuggestion(expt.variants.b)
      expect(expt.loadLastView()).toBe(expt.variants.a)
      expect(expt.loadStickySuggestion()).toBe(expt.variants.b)

  describe "Myna.Experiment.{load,save,clear}StickyReward (#{localStorageStatus})", ->
    it "should load nothing if nothing has been saved", initialized (expt) ->
      expt.clearStickyReward()
      expect(expt.loadStickyReward()).toEqual(null)

    it "should load the last saved suggestion", initialized (expt) ->
      expt.saveStickyReward(expt.variants.a)
      expect(expt.loadStickyReward()).toBe(expt.variants.a)

      expt.saveStickyReward(expt.variants.b)
      expect(expt.loadStickyReward()).toBe(expt.variants.b)

    it "should not interfere with other experiments", initialized (expt) ->
      expt2 = new Myna.Experiment(uuid: "uuid2", id: "id2")
      expt.saveStickyReward(expt.variants.a)
      expect(expt2.loadStickyReward()).toEqual(null)

    it "should not interfere with the last or sticky suggestion", initialized (expt) ->
      expt.saveLastView(expt.variants.a)
      expt.saveStickySuggestion(expt.variants.b)
      expt.saveStickyReward(expt.variants.c)
      expect(expt.loadLastView()).toBe(expt.variants.a)
      expect(expt.loadStickySuggestion()).toBe(expt.variants.b)
      expect(expt.loadStickyReward()).toBe(expt.variants.c)

describe "Myna.Experiment.loadVariantsFor{Suggest,Reward}", ->
  it "should return 'viewed' and 'rewarded' variants when sticky is true", initialized (expt) ->
    expect(expt.loadVariantsForSuggest().viewed).toEqual(null)
    expect(expt.loadVariantsForReward().rewarded).toEqual(null)
    expt.saveStickySuggestion(expt.variants.a)
    expect(expt.loadVariantsForSuggest().viewed).toEqual(expt.variants.a)
    expect(expt.loadVariantsForReward().rewarded).toEqual(null)
    expt.saveStickyReward(expt.variants.b)
    expect(expt.loadVariantsForSuggest().viewed).toEqual(expt.variants.a)
    expect(expt.loadVariantsForReward().rewarded).toEqual(expt.variants.b)

  it "should return null 'viewed' and 'rewarded' variants when sticky is false", initialized (expt) ->
    # If an experiment is non-sticky, we should ignore local storage
    # even if there are variants in there. This allows the customer
    # to switch from sticky to non-sticky mid-stream.
    expt.settings.set("myna.web.sticky", false)
    expt.saveStickySuggestion(expt.variants.a)
    expt.saveStickyReward(expt.variants.b)
    expect(expt.loadVariantsForSuggest().viewed).toEqual(null)
    expect(expt.loadVariantsForReward().rewarded).toEqual(null)
