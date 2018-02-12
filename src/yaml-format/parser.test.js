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

  it('yaml is only parsed if input is a string', function() {
    const { parser, safeLoadSpy } = set_up({'safeLoadSpyReturns': []})
    parser({'h1 text': ''})
    safeLoadSpy.should.not.be.called()
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
  const set_up = function() {
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
      assert.deepEqual(parser(''), output)
    })
  })
})



describe('yaml format - rows component', function() {
  const set_up = function() {
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
    {
      'input': {'rows': [
        {'attr:query': 'asd'},
        {'data': 'xxxxx'},
      ]},
      'output': {
        'component': 'rows',
        'args': {'query': 'asd'},
        'data': 'xxxxx'
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
  const set_up = function() {
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
  const set_up = function() {
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
        'args': {'type': 'pie'},
        'data': []
      }
    },
    {
      'input': {'bar chart': []},
      'output': {
        'component': 'chart',
        'args': {'type': 'bar'},
        'data': []
      }
    },
    {
      'input': {'bar chart': 'foo'},
      'output': {
        'component': 'chart',
        'args': {'type': 'bar'},
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

describe('yaml format - handling URL', function() {
  const set_up = function() {
    const injector = require('inject-loader!./parser.js')
    const safeLoadSpy = sinon.spy(x => x)
    const parser = injector({
      'js-yaml': {'safeLoad': safeLoadSpy},
    }).default

    return { parser }
  }

  const tests = [
    {
      'input': {'h1 text': 'https://example.com/text.csv'},
      'output': {
        'component': 'text',
        'args': {'loader': 'csv', 'tagName': 'h1'},
        'data': 'https://example.com/text.csv'
      }
    },
    {
      'input': {'h1 text': 'https://example.com/text.json'},
      'output': {
        'component': 'text',
        'args': {'loader': 'json', 'tagName': 'h1'},
        'data': 'https://example.com/text.json'
      }
    },
    {
      'input': {'h1 text': [
        {'attr:loader': 'csv'},
        {'data': 'https://example.com/text.json'}
      ]},
      'output': {
        'component': 'text',
        'args': {'loader': 'csv', 'tagName': 'h1'},
        'data': 'https://example.com/text.json'
      }
    }
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]]}`, function() {
      const { parser } = set_up(input)
      assert.deepEqual(parser(input), output)
    })
  })
})


describe('yaml format - attr: syntax', function() {
  const set_up = function() {
    const injector = require('inject-loader!./parser.js')
    const safeLoadSpy = sinon.spy(x => x)
    const parser = injector({
      'js-yaml': {'safeLoad': safeLoadSpy},
    }).default

    return { parser }
  }

  const tests = [
    {
      'input': {'h1 text': [
        {'attr:foo': 'bar'},
        {'data': 'https://example.com/text.csv'}
      ]},
      'output': {
        'component': 'text',
        'args': {'loader': 'csv', 'tagName': 'h1', 'foo': 'bar'},
        'data': 'https://example.com/text.csv'
      }
    },
    {
      'input': {'h1 text': [
        {'attr:foo': 'bar'},
        {'data': 'https://example.com/text.json'}
      ]},
      'output': {
        'component': 'text',
        'args': {'loader': 'json', 'tagName': 'h1', 'foo': 'bar'},
        'data': 'https://example.com/text.json'
      }
    },
    {
      'input': {'pie chart': [
        {'attr:foo': 'bar'},
        {'data': 'https://example.com/text.json'}
      ]},
      'output': {
        'component': 'chart',
        'args': {'loader': 'json', 'type': 'pie', 'foo': 'bar'},
        'data': 'https://example.com/text.json'
      }
    },
    {
      'input': {'pie chart': [
        {'attr:bar': 'foo'},
        {'data': 'https://example.com/text.json'}
      ]},
      'output': {
        'component': 'chart',
        'args': {'loader': 'json', 'type': 'pie', 'bar': 'foo'},
        'data': 'https://example.com/text.json'
      }
    },
    {
      'input': {'pie chart': [
        {'attr:title': 'Hello World'},
        {'attr:pi': 3.14},
        {'data': 'https://example.com/text.json'}
      ]},
      'output': {
        'component': 'chart',
        'args': {'loader': 'json', 'type': 'pie', 'title': 'Hello World',
          'pi': 3.14},
        'data': 'https://example.com/text.json'
      }
    },
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${Object.values(input)[0].map(Object.keys)}`, function() {
      const { parser } = set_up(input)
      assert.deepEqual(parser(input), output)
    })
  })
})

describe('integration tests', () => {
  it('integration test', () => {
    const parser = require('./parser.js').default
    const text = `dashboard "asd":
    - h1 text: asd
    - 3 columns:
      - p text: lorem ipsum
      - p text:
        - attr:foo: bar
        - data: x`
    const value = {
      'component': 'root',
      'args': {'title': 'asd'},
      'data': [
        {'component': 'text',
          'args': {'tagName': 'h1'},
          'data': 'asd'},
        {
          'component': 'columns',
          'args': {'columns': 3},
          'data': [
            {
              'component': 'text',
              'args': {'tagName': 'p'},
              'data': 'lorem ipsum'
            },
            {
              'component': 'text',
              'args': {'tagName': 'p', 'foo': 'bar'},
              'data': 'x'
            }

          ]
        }

      ],
    }

    assert.deepEqual(parser(text), value)
  })
})

describe('yaml format - dropdown component', function() {
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
      'input': {'dropdown foo=bar': []},
      'output': {
        'component': 'dropdown',
        'args': {'variable': 'foo', 'default': 'bar'},
        'data': []
      }
    },
    {
      'input': {'dropdown foo=3.14': []},
      'output': {
        'component': 'dropdown',
        'args': {'variable': 'foo', 'default': '3.14'},
        'data': []
      }
    },
    {
      'input': {'dropdown name3=3.14': []},
      'output': {
        'component': 'dropdown',
        'args': {'variable': 'name3', 'default': '3.14'},
        'data': []
      }
    },
    {
      'input': {'dropdown name3=3.14': 42},
      'output': {
        'component': 'dropdown',
        'args': {'variable': 'name3', 'default': '3.14'},
        'data': 42
      }
    },
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]]}`, function() {
      const { parser } = set_up(input)
      assert.deepEqual(parser(''), output)
    })
  })
})



