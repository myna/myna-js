describe "Myna.Experiment", ->
  pending = ->
    expect("Have we written this test yet?").toEqual("Nope - it's pending.")

  beforeEach ->
    this.addMatchers toBeInstanceOf: (expected) ->
      this.actual instanceof expected

  expt = new Myna.Experiment
    uuid: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    name: "name"
    settings:
      sticky: true
    variants:
      a: { settings: { buttons: "red"   }, weight: 0.2 }
      b: { settings: { buttons: "green" }, weight: 0.4 }
      c: { settings: { buttons: "blue"  }, weight: 0.6 }

  describe "constructor", ->
    it "should accept custom options", ->
      expect(expt.uuid).toEqual("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
      expect(expt.name).toEqual("name")
      expect(expt.settings.data).toEqual(sticky: true)
      expect(for key, value of expt.variants then key).toEqual(["a", "b", "c"])
      expect(for key, value of expt.variants then value.name).toEqual(["a", "b", "c"])
      expect(for key, value of expt.variants then value.settings.data).toEqual([
        { buttons: "red"   }
        { buttons: "green" }
        { buttons: "blue"  }
      ])
      expect(for key, value of expt.variants then value.weight).toEqual([ 0.2, 0.4, 0.6 ])

    it "should succeed if no settings or variants are provided", ->
      actual = new Myna.Experiment(uuid: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", name: "name")
      expect(actual.settings.data).toEqual({})
      expect(actual.variants).toEqual({})

    it "should fail if no uuid is provided", ->
      expect(-> new Myna.Experiment(name: "name")).toThrow()

    it "should provide a sensible default name is provided", ->
      expect(new Myna.Experiment(uuid: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa").name).toEqual("Unnamed experiment")

  describe "sticky", ->
    it "should be derived from the 'myna.sticky' setting", ->
      expect(new Myna.Experiment(uuid: "uuid", name: "name", settings: "myna.sticky": true).sticky()).toEqual(true)
      expect(new Myna.Experiment(uuid: "uuid", name: "name", settings: "myna.sticky": false).sticky()).toEqual(false)

    it "should default to true", ->
      expect(new Myna.Experiment(uuid: "uuid", name: "name").sticky()).toEqual(true)

  describe "totalWeight", ->
    it "should return the sum of the variants' weights, even if they don't total 1.0", ->
      expect(expt.totalWeight()).toBeCloseTo(1.2, 0.001)

  describe "randomVariant", ->
    it "should return ... er ... random variants", ->
      names = []
      for i in [1..100]
        actual = expt.randomVariant()
        expect(actual).toBeInstanceOf(Myna.Variant)
        names.push(actual.name)
      expect(names).toContain("a")
      expect(names).toContain("b")
      expect(names).toContain("c")

    it "should skew in favour of the most popular variants", ->
      expt.variants.a.weight = 0.0
      expt.variants.c.weight = 0.0
      names = []
      for i in [1..100]
        names.push(expt.randomVariant().name)
      expect(names).not.toContain("a")
      expect(names).toContain("b")
      expect(names).not.toContain("c")

  for localStorageEnabled in [false, true] # end up resetting it to true
    Myna.cache.localStorageEnabled = localStorageEnabled

    localStorageStatus =
      "localStorage " +
      (if Myna.cache.localStorageSupported then ' supported,' else ' unsupported,') +
      (if Myna.cache.localStorageEnabled then ' enabled' else ' disabled')

    describe "{load,save,clear}LastSuggestion - #{localStorageStatus}", ->
      it "should load nothing if nothing has been saved", ->
        expt.clearLastSuggestion()
        expect(expt.loadLastSuggestion()).toEqual(null)

      it "should load the last saved suggestion", ->
        expt.saveLastSuggestion(expt.variants.a)
        expect(expt.loadLastSuggestion()).toBe(expt.variants.a)

        expt.saveLastSuggestion(expt.variants.b)
        expect(expt.loadLastSuggestion()).toBe(expt.variants.b)

      it "should not interfere with other experiments", ->
        expt2 = new Myna.Experiment
          uuid: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
          name: "name2"
        expt.saveLastSuggestion(expt.variants.a)
        expect(expt2.loadLastSuggestion()).toEqual(null)

    describe "{load,save,clear}StickySuggestion - #{localStorageStatus}", ->
      it "should load nothing if nothing has been saved", ->
        expt.clearStickySuggestion()
        expect(expt.loadStickySuggestion()).toEqual(null)

      it "should load the last saved suggestion", ->
        expt.saveStickySuggestion(expt.variants.a)
        expect(expt.loadStickySuggestion()).toBe(expt.variants.a)

        expt.saveStickySuggestion(expt.variants.b)
        expect(expt.loadStickySuggestion()).toBe(expt.variants.b)

      it "should not interfere with other experiments", ->
        expt2 = new Myna.Experiment
          uuid: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
          name: "name2"
        expt.saveStickySuggestion(expt.variants.a)
        expect(expt2.loadStickySuggestion()).toEqual(null)

      it "should not interfere with the last suggestion", ->
        expt.saveLastSuggestion(expt.variants.a)
        expt.saveStickySuggestion(expt.variants.b)
        expect(expt.loadLastSuggestion()).toBe(expt.variants.a)
        expect(expt.loadStickySuggestion()).toBe(expt.variants.b)

    describe "{load,save,clear}StickyReward - #{localStorageStatus}", ->
      it "should load nothing if nothing has been saved", ->
        expt.clearStickyReward()
        expect(expt.loadStickyReward()).toEqual(null)

      it "should load the last saved suggestion", ->
        expt.saveStickyReward(expt.variants.a)
        expect(expt.loadStickyReward()).toBe(expt.variants.a)

        expt.saveStickyReward(expt.variants.b)
        expect(expt.loadStickyReward()).toBe(expt.variants.b)

      it "should not interfere with other experiments", ->
        expt2 = new Myna.Experiment
          uuid: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
          name: "name2"
        expt.saveStickyReward(expt.variants.a)
        expect(expt2.loadStickyReward()).toEqual(null)

      it "should not interfere with the last or sticky suggestion", ->
        expt.saveLastSuggestion(expt.variants.a)
        expt.saveStickySuggestion(expt.variants.b)
        expt.saveStickyReward(expt.variants.c)
        expect(expt.loadLastSuggestion()).toBe(expt.variants.a)
        expect(expt.loadStickySuggestion()).toBe(expt.variants.b)
        expect(expt.loadStickyReward()).toBe(expt.variants.c)
