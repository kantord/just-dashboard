import parse from './parser/parser'
import RootComponent from './components/root/Root'
import TextComponent from './components/text/Text'

const components: Record<string, unknown> = {
  'root': RootComponent,
  'text': TextComponent,
}

const test_parser = parse((component) => components[component] as any)

export default test_parser
