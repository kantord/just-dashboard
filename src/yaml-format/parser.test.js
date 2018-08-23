import should from 'should' // eslint-disable-line no-unused-vars
import assert from 'assert'
import sinon from 'sinon'


describe('yaml format - parser', function() {

  const set_up = function({parseSpyReturns, parseSpyThrows}) {
    const injector = require('inject-loader!./parser.js')
    let parseSpy = sinon.stub().returns(parseSpyReturns)
    if (parseSpyThrows)
      parseSpy = parseSpy.throws(new Error(parseSpyThrows))
    const injected = injector({
      'yamljs': {parse: parseSpy},
    })

    const parser = injected.default
    const error_message = injected.error_message

    return { parser, parseSpy, error_message }
  }

  it('should display error for empty input', function() {
    const { parser, error_message } = set_up({'parseSpyReturns': undefined})
    parser('').should.deepEqual(
      error_message('A non-empty input file is required'))
  })

  it('should display error thrown by safeLoad', function() {
    const error = 'foo bar baz!'
    const { parser, error_message } = set_up({'parseSpyThrows': error})
    parser('').should.deepEqual(
      error_message('Error: ' + error))
  })

  it('should not display error for valid input', function() {
    const { parser, error_message } = set_up({'parseSpyReturns': {
      'dashboard "Hello World"': []
    }})
    parser('dashboard "Hello World": []').should.not.deepEqual(
      error_message('A non-empty input file is required'))
  })

  it('yaml is only parsed if input is a string', function() {
    const { parser, parseSpy } = set_up({'parseSpyReturns': []})
    parser({'h1 text': ''})
    parseSpy.should.not.be.called()
  })

  const inputs = ['foo', 'bar']

  inputs.forEach((arg) =>
    it(`yaml called with input - ${arg}`, function() {
      const { parser, parseSpy } = set_up(
        {'parseSpyReturns': {'dashboard "a"': []}})
      parser(arg)
      parseSpy.should.be.calledWith(arg)
    })
  )
})

describe('yaml format - root component', function() {
  const set_up = function() {
    const injector = require('inject-loader!./parser.js')
    const parseSpy = sinon.spy(x => x)
    const parser = injector({
      'yamljs': {parse: parseSpy},
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
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]].length}`,
      () => {
        const { parser } = set_up(input)
        assert.deepEqual(parser(input), output)
      })
  })
})


describe('yaml format - text component', function() {
  const set_up = function(parseSpyReturns) {
    const injector = require('inject-loader!./parser.js')
    const parseSpy = sinon.stub().returns(parseSpyReturns)
    const parser = injector({
      'yamljs': {parse: parseSpy},
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
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]]}`, () => {
      const { parser } = set_up(input)
      assert.deepEqual(parser(''), output)
    })
  })
})


describe('yaml format - board component', function() {
  const set_up = function() {
    const injector = require('inject-loader!./parser.js')
    const parseSpy = sinon.spy(x => x)
    const parser = injector({
      'yamljs': {parse: parseSpy},
    }).default

    return { parser }
  }

  const tests = [
    {
      'input': {'board': []},
      'output': {
        'component': 'board',
        'data': []
      }
    },
    {
      'input': {'board': [{'board': []}]},
      'output': {
        'component': 'board',
        'data': [{
          'component': 'board',
          'data': []
        }]
      }
    },
    {
      'input': {'board': [
        {'attr:query': 'asd'},
        {'data': 'xxxxx'},
      ]},
      'output': {
        'component': 'board',
        'args': {'query': 'asd'},
        'data': 'xxxxx'
      }
    },
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]].length}`,
      () => {
        const { parser } = set_up(input)
        assert.deepEqual(parser(input), output)
      })
  })
})




describe('yaml format - rows component', function() {
  const set_up = function() {
    const injector = require('inject-loader!./parser.js')
    const parseSpy = sinon.spy(x => x)
    const parser = injector({
      'yamljs': {parse: parseSpy},
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
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]].length}`,
      () => {
        const { parser } = set_up(input)
        assert.deepEqual(parser(input), output)
      })
  })
})

describe('yaml format - tabs component', function() {
  const set_up = function() {
    const injector = require('inject-loader!./parser.js')
    const parseSpy = sinon.spy(x => x)
    const parser = injector({
      'yamljs': {parse: parseSpy},
    }).default

    return { parser }
  }

  const tests = [
    {
      'input': {'tabs': [
        {'attr:query': 'asd'},
        {'data': [
          {"foo bar": {"h2 text": "asd"}},
          {"foo baz": {"h1 text": "sd"}},
        ]},
      ]},
      'output': {
        'component': 'tabs',
        'args': {'query': 'asd'},
        'data': [
          {
            'foo bar': {
              'component': 'text',
              'args': {'tagName': 'h2'},
              'data': 'asd'
            },
          },
          {
            'foo baz': {
              'component': 'text',
              'args': {'tagName': 'h1'},
              'data': 'sd'
            },
          }
        ]
      }
    },
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]].length}`,
      () => {
        const { parser } = set_up(input)
        assert.deepEqual(parser(input), output)
      })
  })
})

describe('yaml format - columns component', function() {
  const set_up = function() {
    const injector = require('inject-loader!./parser.js')
    const parseSpy = sinon.spy(x => x)
    const parser = injector({
      'yamljs': {parse: parseSpy},
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
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]].length}`,
      () => {
        const { parser } = set_up(input)
        assert.deepEqual(parser(input), output)
      })
  })
})

describe('yaml format - chart component', function() {
  const set_up = function() {
    const injector = require('inject-loader!./parser.js')
    const parseSpy = sinon.spy(x => x)
    const parser = injector({
      'yamljs': {parse: parseSpy},
    }).default

    return { parser }
  }

  const tests = [
    {
      'input': {'pie chart': []},
      'output': {
        'component': 'chart',
        'args': {'type': 'pie', 'stacked': false},
        'data': []
      }
    },
    {
      'input': {'bar chart': []},
      'output': {
        'component': 'chart',
        'args': {'type': 'bar', 'stacked': false},
        'data': []
      }
    },
    {
      'input': {'horizontal bar chart': []},
      'output': {
        'component': 'chart',
        'args': {'type': 'bar', 'stacked': false, 
          'axis': {
            'rotated': true
          },
        },
        'data': []
      }
    },
    {
      'input': {'rotated line chart': []},
      'output': {
        'component': 'chart',
        'args': {'type': 'line', 'stacked': false, 
          'axis': {
            'rotated': true
          },
        },
        'data': []
      }
    },
    {
      'input': {'scatter plot': []},
      'output': {
        'component': 'chart',
        'args': {'type': 'scatter', 'stacked': false},
        'data': []
      }
    },
    {
      'input': {'line diagram': []},
      'output': {
        'component': 'chart',
        'args': {'type': 'line', 'stacked': false},
        'data': []
      }
    },
    {
      'input': {'line graph': []},
      'output': {
        'component': 'chart',
        'args': {'type': 'line', 'stacked': false},
        'data': []
      }
    },
    {
      'input': {'bar chart': 'foo'},
      'output': {
        'component': 'chart',
        'args': {'type': 'bar', 'stacked': false},
        'data': 'foo'
      }
    },
    {
      'input': {'stacked bar chart': 'foo'},
      'output': {
        'component': 'chart',
        'args': {'type': 'bar', 'stacked': true},
        'data': 'foo'
      }
    },
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]]}`, () => {
      const { parser } = set_up(input)
      assert.deepEqual(parser(input), output)
    })
  })
})

describe('yaml format - handling file', function() {
  const set_up = function() {
    const injector = require('inject-loader!./parser.js')
    const parseSpy = sinon.spy(x => x)
    const parser = injector({
      'yamljs': {parse: parseSpy},
    }).default

    return { parser }
  }

  const tests = [
    {
      'input': {'h1 text': 'file://example.com/text.csv'},
      'output': {
        'component': 'text',
        'args': {'loader': 'csv', 'tagName': 'h1', 'is_file': true},
        'data': 'file://example.com/text.csv'
      }
    },
    {
      'input': {'h1 text': 'file://example.com/text.json'},
      'output': {
        'component': 'text',
        'args': {'loader': 'json', 'tagName': 'h1', 'is_file': true},
        'data': 'file://example.com/text.json'
      }
    },
    {
      'input': {'h1 text': [
        {'attr:loader': 'csv'},
        {'data': 'file://example.com/text.json'}
      ]},
      'output': {
        'component': 'text',
        'args': {'loader': 'csv', 'tagName': 'h1', 'is_file': true},
        'data': 'file://example.com/text.json'
      }
    }
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]]}`, () => {
      const { parser } = set_up(input)
      assert.deepEqual(parser(input), output)
    })
  })
})


describe('yaml format - handling URL', function() {
  const set_up = function() {
    const injector = require('inject-loader!./parser.js')
    const parseSpy = sinon.spy(x => x)
    const parser = injector({
      'yamljs': {parse: parseSpy},
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
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]]}`, () => {
      const { parser } = set_up(input)
      assert.deepEqual(parser(input), output)
    })
  })
})


describe('yaml format - attr: syntax', function() {
  const set_up = function() {
    const injector = require('inject-loader!./parser.js')
    const parseSpy = sinon.spy(x => x)
    const parser = injector({
      'yamljs': {parse: parseSpy},
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
        'args': {'loader': 'json', 'type': 'pie', 'foo': 'bar',
          'stacked': false},
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
        'args': {'loader': 'json', 'type': 'pie', 'bar': 'foo',
          'stacked': false},
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
          'pi': 3.14, 'stacked': false},
        'data': 'https://example.com/text.json'
      }
    },
    {
      'input': {'${var_Name1} chart': [
        {'attr:title': 'Hello World'},
        {'attr:pi': 3.14},
        {'data': 'https://example.com/text.json'}
      ]},
      'output': {
        'component': 'chart',
        'args': {'loader': 'json', 'type': '${var_Name1}', 
          'title': 'Hello World', 'pi': 3.14, 'stacked': false},
        'data': 'https://example.com/text.json'
      }
    },
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${Object.values(input)[0].map(Object.keys)}`,
      function() {
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
  const set_up = function(parseSpyReturns) {
    const injector = require('inject-loader!./parser.js')
    const parseSpy = sinon.stub().returns(parseSpyReturns)
    const parser = injector({
      'yamljs': {parse: parseSpy},
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
    {
      'input': {'dropdown chart=pie': 42},
      'output': {
        'component': 'dropdown',
        'args': {'variable': 'chart', 'default': 'pie'},
        'data': 42
      }
    },
  ]


  tests.forEach(function({input, output}) {
    it(`${Object.keys(input)[0]} - ${input[Object.keys(input)[0]]}`, () => {
      const { parser } = set_up(input)
      assert.deepEqual(parser(''), output)
    })
  })
})



