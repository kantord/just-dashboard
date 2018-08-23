import Component from '../base'
import default_parser from '../../default_parser.js'
import './Tabs.scss'

const TabsComponent = Component({
  'validators': [],
  'init': (args, selection) => selection
    .append('div').attr('class', 'ds--tabs'),
  'render': (args, selection, data, element) => {
    const activeTabDefinition = Object.values(data[0])[0]
    console.log(activeTabDefinition) // eslint-disable-line
    const activeTabWrapper = element
      .append('div').attr('class', 'ds--tabs-element')
    const renderActiveTab = default_parser(activeTabDefinition)
    renderActiveTab(activeTabWrapper)
  },
})

export default TabsComponent
