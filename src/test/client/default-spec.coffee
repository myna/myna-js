Promise       = require('es6-promise').Promise
DefaultClient = require '../../main/client/default'
base          = require '../spec-base'

describe "DefaultClient", ->
  beforeEach (done) ->
    console.log('beforeEach started')
    @variants = [
      { typename: "variant", id: "a", settings: { buttons: "red"   }, weight: 0.2 }
      { typename: "variant", id: "b", settings: { buttons: "green" }, weight: 0.4 }
      { typename: "variant", id: "c", settings: { buttons: "blue"  }, weight: 0.6 }
    ]
    @basicExpt = {
      uuid:     "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      id:       "basic"
      settings: {}
      variants: @variants
    }
    @stickyExpt = {
      uuid:     "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      id:       "sticky"
      settings: myna: web: sticky: true
      variants: @variants
    }
    @client = new DefaultClient(
      [ @basicExpt, @stickyExpt ]
      base.testClientOptions
    )
    @client.record.clear()
    @client.clear('basic').then =>
      @client.clear('sticky').then ->
        console.log('beforeEach finish')
        done()
    return

  describe "suggest", ->
    it "should return variants", (done) ->
      @client.suggest('basic').then (variant) ->
        expect(variant.typename).toEqual("variant")
        done()

    it "should return all variants over time for a basic experiment", (done) ->
      iterate = (times, ids = []) =>
        if times > 0
          @client.suggest('basic').then (variant) ->
            iterate(times - 1, ids.concat [ variant.id ])
        else
          Promise.resolve(ids)

      iterate(100).then (ids) =>
        expect(ids).toContain("a")
        expect(ids).toContain("b")
        expect(ids).toContain("c")
        done()

    it "should skew in favour of the most popular variants for a basic experiment", ->
      @basicExpt.variants[0].weight = 0.0
      @basicExpt.variants[1].weight = 0.0

      iterate = (times, ids = []) =>
        if times > 0
          @client.suggest('basic').then (variant) ->
            iterate(times - 1, ids.concat [ variant.id ])
        else
          Promise.resolve(ids)

      iterate(100).then (ids) ->
        expect(ids).not.toContain("a")
        expect(ids).not.toContain("b")
        expect(ids).toContain("c")
        done()

    it "should always return a single variant for a sticky experiment", (done) ->
      @client.suggest('sticky').then (variant0) =>
        iterate = (times) =>
          if times > 0
            @client.suggest('sticky').then (variant) ->
              expect(variant.id).toEqual(variant0.id)
              iterate(times - 1)
          else
            done()

        iterate(10)

    it "should queue a view event for upload", (done) ->
      spy = spyOn(@client.record, 'sync').and.callFake (->)
      @client.suggest('basic').then (variant) =>
        queue = @client.record._queue()
        expect(queue.length).toEqual(1)
        expect(queue[0].typename).toEqual('view')
        expect(queue[0].experiment).toEqual(@basicExpt.uuid)
        expect(queue[0].variant).toEqual(variant.id)
        done()

  describe "view", ->
    it "should find a variant by id", (done) ->
      @client.view('basic', "b").then (variant) =>
        expect(variant.id).toEqual("b")
        done()

    it "should find a variant by object", (done) ->
      @client.view('basic', 'b').then (variant) =>
        expect(variant.id).toEqual("b")
        done()

    it "should fail gracefully if variantOrId is null", (done) ->
      @client.view('basic', "e").then(=> @fail()).catch(=> done())

    it "should always view the specified variant for a non-sticky experiment", (done) ->
      @client.view('basic', 'a').then (variant0) =>
        @client.view('basic', 'b').then (variant1) ->
          expect(variant0.id).toEqual('a')
          expect(variant1.id).toEqual('b')
          done()

    it "should override with the sticky variant for a sticky experiment", (done) ->
      @client.view('sticky', 'a').then (variant0) =>
        @client.view('sticky', 'b').then (variant1) ->
          expect(variant0.id).toEqual('a')
          expect(variant1.id).toEqual('a')
          done()

    it "should queue a view event for upload", (done) ->
      spy = spyOn(@client.record, 'sync').and.callFake (->)
      @client.view('basic', 'b').then (variant) =>
        queue = @client.record._queue()
        expect(queue.length).toEqual(1)
        expect(queue[0].typename).toEqual('view')
        expect(queue[0].experiment).toEqual(@basicExpt.uuid)
        expect(queue[0].variant).toEqual('b')
        done()

  describe "reward", ->
    it "should reward the last-suggested variant", (done) ->
      @client.suggest('basic').then (viewed) =>
        @client.reward('basic').then (rewarded) ->
          expect(viewed.id).toEqual(rewarded.id)
          done()

    it "should reward the last-viewed variant", (done) ->
      @client.view('basic', 'b').then (viewed) =>
        @client.reward('basic').then (rewarded) ->
          expect(viewed.id).toEqual('b')
          expect(rewarded.id).toEqual('b')
          done()

    it "should fail if no variant was suggested", (done) ->
      @client.reward('basic').catch (error) =>
        done()
