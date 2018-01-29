import should from 'should' // eslint-disable-line no-unused-vars
import assert from 'assert'
import sinon from 'sinon'

describe('yaml format - parser', function() {

  const set_up = function({safeLoadSpyReturns}) {
    const injector = require('inject-loader!./parser.js')
    const safeLoadSpy = sinon.stub().returns(safeLoadSpyReturns)
    const parser = injector({
      'js-yaml': {'safeLoad': safeLoadSpy},
    }).default

    return { parser, safeLoadSpy }
  }

  it('should throw error for empty input', function() {
    (function() {
      const { parser } = set_up({'safeLoadSpyReturns': undefined})
      parser('')
    }).should.throw('A non-empty input file is required')
  })

  it('should not throw error for valid input', function() {
    (function() {
      const { parser } = set_up({'safeLoadSpyReturns': []})
      parser('dashboard "Hello World": []')
    }).should.not.throw('A non-empty input file is required')
  })

  const inputs = ['foo', 'bar']

  inputs.forEach((arg) =>
    it(`yaml called with input - ${arg}`, function() {
      const { parser, safeLoadSpy } = set_up({'safeLoadSpyReturns': {'dashboard "a"': []}})
      parser(arg)
      safeLoadSpy.should.be.calledWith(arg)
    })
  )
})

describe('yaml format - root component', function() {
  const set_up = function(safeLoadSpyReturns) {
    const injector = require('inject-loader!./parser.js')
    const safeLoadSpy = sinon.spy(x => x)
    const parser = injector({
      'js-yaml': {'safeLoad': safeLoadSpy},
    }).default

    return { parser }
  }

  const tests = [
    {
      'input': {'dashboard "Foo"': []},
      'output': {
        'component': 'root',
        'args': {'title': 'Foo'},
        'data': []
      }
    },
    {
      'input': {'dashboard "Bar"': []},
      'output': {
        'component': 'root',
        'args': {'title': 'Bar'},
        'data': []
      }
    },
    {
      'input': {'dashboard \'x\'': []},
      'output': {
        'component': 'root',
        'args': {'title': 'x'},
        'data': []
      }
    },
    {
      'input': {'dashboard \'Ba"r\'': []},
      'output': {
        'component': 'root',
        'args': {'title': 'Ba"r'},
        'data': []
      }
    },
    {
      'input': {'dashboard "Foo"': [{'b text': 'a'}]},
      'output': {
        'component': 'root',
        'args': {'title': 'Foo'},
        'data': [{
          'component': 'text',
          'args': {'tagName': 'b'},
          'data': 'a'
        }]
      }
    },
    {
      'input': {'dashboard "Foo"': [{'p text': 'x'}, {'h1 text': 'p'}]},
      'output': {
        'component': 'root',
        'args': {'title': 'Foo'},
        'data': [{
          'component': 'text',
          'args': {'tagName': 'p'},
          'data': 'x'
        },
        {
          'component': 'text',
          'args': {'tagName': 'h1'},
          'data': 'p'
        }
        ]
      }
    },
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]].length}`, function() {
      const { parser } = set_up(input)
      assert.deepEqual(parser(input), output)
    })
  })
})


describe('yaml format - text component', function() {
  const set_up = function(safeLoadSpyReturns) {
    const injector = require('inject-loader!./parser.js')
    const safeLoadSpy = sinon.stub().returns(safeLoadSpyReturns)
    const parser = injector({
      'js-yaml': {'safeLoad': safeLoadSpy},
    }).default

    return { parser }
  }

  const tests = [
    {
      'input': {'h1 text': []},
      'output': {
        'component': 'text',
        'args': {'tagName': 'h1'},
        'data': []
      }
    },
    {
      'input': {'p text': []},
      'output': {
        'component': 'text',
        'args': {'tagName': 'p'},
        'data': []
      }
    },
    {
      'input': {'p text': 'foo'},
      'output': {
        'component': 'text',
        'args': {'tagName': 'p'},
        'data': 'foo'
      }
    },
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]]}`, function() {
      const { parser } = set_up(input)
      assert.deepEqual(parser(), output)
    })
  })
})



describe('yaml format - rows component', function() {
  const set_up = function(safeLoadSpyReturns) {
    const injector = require('inject-loader!./parser.js')
    const safeLoadSpy = sinon.spy(x => x)
    const parser = injector({
      'js-yaml': {'safeLoad': safeLoadSpy},
    }).default

    return { parser }
  }

  const tests = [
    {
      'input': {'rows': []},
      'output': {
        'component': 'rows',
        'data': []
      }
    },
    {
      'input': {'rows': [{'rows': []}]},
      'output': {
        'component': 'rows',
        'data': [{
          'component': 'rows',
          'data': []
        }]
      }
    },
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]].length}`, function() {
      const { parser } = set_up(input)
      assert.deepEqual(parser(input), output)
    })
  })
})

describe('yaml format - columns component', function() {
  const set_up = function(safeLoadSpyReturns) {
    const injector = require('inject-loader!./parser.js')
    const safeLoadSpy = sinon.spy(x => x)
    const parser = injector({
      'js-yaml': {'safeLoad': safeLoadSpy},
    }).default

    return { parser }
  }

  const tests = [
    {
      'input': {'columns': []},
      'output': {
        'component': 'columns',
        'data': []
      }
    },
    {
      'input': {'columns': [{'columns': []}]},
      'output': {
        'component': 'columns',
        'data': [{
          'component': 'columns',
          'data': []
        }]
      }
    },
    {
      'input': {'3 columns': [{'columns': []}]},
      'output': {
        'component': 'columns',
        'args': {'columns': 3},
        'data': [{
          'component': 'columns',
          'data': []
        }]
      }
    },
    {
      'input': {'5 columns': [{'columns': []}]},
      'output': {
        'component': 'columns',
        'args': {'columns': 5},
        'data': [{
          'component': 'columns',
          'data': []
        }]
      }
    },
    {
      'input': {'5 columns': [{'rows': []}, {'columns': []}]},
      'output': {
        'component': 'columns',
        'args': {'columns': 5},
        'data': [
          {
            'component': 'rows',
            'data': []
          },
          {
          'component': 'columns',
          'data': []
        }]
      }
    },
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]].length}`, function() {
      const { parser } = set_up(input)
      assert.deepEqual(parser(input), output)
    })
  })
})

describe('yaml format - chart component', function() {
  const set_up = function(safeLoadSpyReturns) {
    const injector = require('inject-loader!./parser.js')
    const safeLoadSpy = sinon.spy(x => x)
    const parser = injector({
      'js-yaml': {'safeLoad': safeLoadSpy},
    }).default

    return { parser }
  }

  const tests = [
    {
      'input': {'pie chart': []},
      'output': {
        'component': 'chart',
        'type': {'type': 'pie'},
        'data': []
      }
    },
    {
      'input': {'bar chart': []},
      'output': {
        'component': 'chart',
        'type': {'type': 'bar'},
        'data': []
      }
    },
    {
      'input': {'bar chart': 'foo'},
      'output': {
        'component': 'chart',
        'type': {'type': 'bar'},
        'data': 'foo'
      }
    },
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]]}`, function() {
      const { parser } = set_up(input)
      assert.deepEqual(parser(input), output)
    })
  })
})
