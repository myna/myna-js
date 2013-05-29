expt = new Myna.ExperimentSummary
  uuid:     "uuid"
  id:       "id"
  settings: "myna.js.sticky": true
  variants: [
    { id: "a", settings: { buttons: "red"   }, weight: 0.2 }
    { id: "b", settings: { buttons: "green" }, weight: 0.4 }
    { id: "c", settings: { buttons: "blue"  }, weight: 0.6 }
  ]

describe "Myna.ExperimentSummary.constructor", ->
  it "should accept custom options", ->
    expect(expt.uuid).toEqual("uuid")
    expect(expt.id).toEqual("id")
    expect(expt.settings.data).toEqual(myna: js: sticky: true)
    expect(for key, value of expt.variants then key).toEqual(["a", "b", "c"])
    expect(for key, value of expt.variants then value.id).toEqual(["a", "b", "c"])
    expect(for key, value of expt.variants then value.settings.data).toEqual([
      { buttons: "red"   }
      { buttons: "green" }
      { buttons: "blue"  }
    ])
    expect(for key, value of expt.variants then value.weight).toEqual([ 0.2, 0.4, 0.6 ])

  it "should succeed if no settings or variants are provided", ->
    actual = new Myna.ExperimentSummary(uuid: "uuid", id: "id")
    expect(actual.settings.data).toEqual({})
    expect(actual.variants).toEqual({})

  it "should succeed if no uuid is provided", ->
    expect(-> new Myna.ExperimentSummary(id: "id")).not.toThrow()

  it "should fail if no id is provided", ->
    expect(-> new Myna.ExperimentSummary(uuid: "uuid")).toThrow()

describe "Myna.ExperimentSummary.sticky", ->
  it "should be derived from the 'myna.js.sticky' setting", ->
    expect(new Myna.ExperimentSummary(uuid: "uuid", id: "id", settings: "myna.js.sticky": true).sticky()).toEqual(true)
    expect(new Myna.ExperimentSummary(uuid: "uuid", id: "id", settings: "myna.js.sticky": false).sticky()).toEqual(false)

  it "should default to true", ->
    expect(new Myna.ExperimentSummary(uuid: "uuid", id: "id").sticky()).toEqual(true)

describe "Myna.ExperimentSummary.totalWeight", ->
  it "should return the sum of the variants' weights, even if they don't total 1.0", ->
    expect(expt.totalWeight()).toBeCloseTo(1.2, 0.001)

describe "Myna.ExperimentSummary.randomVariant", ->
  it "should return ... er ... random variants", ->
    ids = []
    for i in [1..100]
      actual = expt.randomVariant()
      expect(actual).toBeInstanceOf(Myna.VariantSummary)
      ids.push(actual.id)
    expect(ids).toContain("a")
    expect(ids).toContain("b")
    expect(ids).toContain("c")

  it "should skew in favour of the most popular variants", ->
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

  describe "Myna.ExperimentSummary.{load,save,clear}LastView (#{localStorageStatus})", ->
    it "should load nothing if nothing has been saved", ->
      expt.clearLastView()
      expect(expt.loadLastView()).toEqual(null)

    it "should load the last saved suggestion", ->
      expt.saveLastView(expt.variants.a)
      expect(expt.loadLastView()).toBe(expt.variants.a)

      expt.saveLastView(expt.variants.b)
      expect(expt.loadLastView()).toBe(expt.variants.b)

    it "should not interfere with other experiments", ->
      expt2 = new Myna.ExperimentSummary(uuid: "uuid2", id: "id2")
      expt.saveLastView(expt.variants.a)
      expect(expt2.loadLastView()).toEqual(null)

  describe "Myna.ExperimentSummary.{load,save,clear}StickySuggestion (#{localStorageStatus})", ->
    it "should load nothing if nothing has been saved", ->
      expt.clearStickySuggestion()
      expect(expt.loadStickySuggestion()).toEqual(null)

    it "should load the last saved suggestion", ->
      expt.saveStickySuggestion(expt.variants.a)
      expect(expt.loadStickySuggestion()).toBe(expt.variants.a)

      expt.saveStickySuggestion(expt.variants.b)
      expect(expt.loadStickySuggestion()).toBe(expt.variants.b)

    it "should not interfere with other experiments", ->
      expt2 = new Myna.ExperimentSummary(uuid: "uuid2", id: "id2")
      expt.saveStickySuggestion(expt.variants.a)
      expect(expt2.loadStickySuggestion()).toEqual(null)

    it "should not interfere with the last suggestion", ->
      expt.saveLastView(expt.variants.a)
      expt.saveStickySuggestion(expt.variants.b)
      expect(expt.loadLastView()).toBe(expt.variants.a)
      expect(expt.loadStickySuggestion()).toBe(expt.variants.b)

  describe "Myna.ExperimentSummary.{load,save,clear}StickyReward (#{localStorageStatus})", ->
    it "should load nothing if nothing has been saved", ->
      expt.clearStickyReward()
      expect(expt.loadStickyReward()).toEqual(null)

    it "should load the last saved suggestion", ->
      expt.saveStickyReward(expt.variants.a)
      expect(expt.loadStickyReward()).toBe(expt.variants.a)

      expt.saveStickyReward(expt.variants.b)
      expect(expt.loadStickyReward()).toBe(expt.variants.b)

    it "should not interfere with other experiments", ->
      expt2 = new Myna.ExperimentSummary(uuid: "uuid2", id: "id2")
      expt.saveStickyReward(expt.variants.a)
      expect(expt2.loadStickyReward()).toEqual(null)

    it "should not interfere with the last or sticky suggestion", ->
      expt.saveLastView(expt.variants.a)
      expt.saveStickySuggestion(expt.variants.b)
      expt.saveStickyReward(expt.variants.c)
      expect(expt.loadLastView()).toBe(expt.variants.a)
      expect(expt.loadStickySuggestion()).toBe(expt.variants.b)
      expect(expt.loadStickyReward()).toBe(expt.variants.c)
