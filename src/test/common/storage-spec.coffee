storage = require '../../main/common/storage'
local   = require '../../main/common/storage/local'


describe 'storage.get', ->
  it 'should use local storage if available', ->
    enabled = local.enabled
    local.enabled = true
    key = 'foo'
    expect(local.supported).toBeTruthy()
    expect(local.enabled).toBeTruthy()
    storage.set(key, 'bar')
    expect(local.get(key)).toEqual 'bar'
    storage.remove(key)
    local.enabled = enabled
