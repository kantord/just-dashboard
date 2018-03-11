docs: docs/examples docs/components.md docs/screenshots


docs/screenshots: docs/gallery.json
	cat $^ | tr "\n" "\0"| xargs -L1 -0 -n1 -I % bash -c "make docs\/screenshots\/\`echo '%' | jq '.[1]' -r | sed 's/ /_/g'\`.png"

docs/screenshots/%.png: docs/examples/%.js
	rm -f src/_temp.js
	cp $< src/_temp.js
	bash -c "npx webpack src/_temp.js --output-filename screenshot_index.js --config webpack.screenshot.config.js"
	node ./src/screenshot.js $@
	rm -f src/_temp.js

docs/examples/%.js: ./docs/examples/%.yml
	echo " \
	  import {json_parser, yaml_parser} from './index.js'; \
	  import * as d3 from 'd3'; \
	  'so random'; \
	  const render_dashboard = (data) => {; \
		const parserd_yaml = yaml_parser(data); \
		json_parser(parserd_yaml)(d3.selection()); \
	  }; \
	  render_dashboard(\``cat '$<'`\`); \
	  d3.selectAll('path.domain').attr('fill', 'transparent'); \
	  d3.selectAll('path.domain').attr('stroke', 'black'); \
	  d3.selectAll('.bb-chart-line').attr('fill', 'transparent'); \
	" | sed 's/---/\n/' > $@

docs/components.md: docs/gallery.json
	cat $^ | jq --slurp " \
	  group_by(.[0]) | \
	  .[] | [ \
		\"## \" + .[0][0], \
		([.[] | \
		  \"### \" + .[1], \
		  \"![](screenshots/\" + (.[1] | split(\" \") | join(\"_\")) +  \".png)\", \
		  \"[Source](examples/\" + (.[1] | split(\" \") | join(\"_\")) + \".yml)\", \
		  \"\" \
		] | join(\"\n\") ), \
		\"\", \
		\"\"] \
	  | join(\"\n\")" -r > $@

docs/examples: docs/gallery.json
	cat $^ | tr "\n" "\0"| xargs -L1 -0 -n1 -I % bash -c "echo '%' | jq '{\"dashboard \\\"Example\\\"\": [.[2]]}' | ./node_modules/json2yaml/cli.js > docs\/examples\/\`echo '%' | jq '.[1]' -r | sed 's/ /_/g'\`.yml"

docs/gallery.json: $(shell find src/components -name "gallery.json")
	cat $^ | jq -c " \
	  .[] | {\"example\": .examples | to_entries| .[], \"data\": .data, \"category\": .category} | \
	  {\"code\": {(.example.value): .data}, \"category\": .category, \"name\": .example.key} | \
	  [.category, .name, .code] \
	  " > $@
