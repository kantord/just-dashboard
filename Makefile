component_gallery: component_gallery/examples component_gallery/component_gallery.md component_gallery/screenshots


component_gallery/screenshots: component_gallery/gallery.json
	cat $^ | tr "\n" "\0"| xargs -L1 -0 -n1 -I % bash -c "make component_gallery\/screenshots\/\`echo '%' | jq '.[1]' -r | sed 's/ /_/g'\`.png"

component_gallery/screenshots/%.png: component_gallery/examples/%.js
	rm -f src/_temp.js
	cp $< src/_temp.js
	bash -c "npx webpack src/_temp.js --output-filename screenshot_index.js --config webpack.screenshot.config.js"
	node ./src/screenshot.js $@
	rm -f src/_temp.js

component_gallery/examples/%.js: ./component_gallery/examples/%.yml
	echo " \
	  import {json_parser, yaml_parser} from './index.js'; \
	  import * as d3 from 'd3'; \
	  'so random'; \
	  const render_dashboard = (data) => {; \
		const parserd_yaml = yaml_parser(data); \
		json_parser(parserd_yaml)(d3.selection()); \
	  }; \
	  render_dashboard(\``cat '$<'`\`) \
	" | sed 's/---/\n/' > $@

component_gallery/component_gallery.md: component_gallery/gallery.json
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

component_gallery/examples: component_gallery/gallery.json
	cat $^ | tr "\n" "\0"| xargs -L1 -0 -n1 -I % bash -c "echo '%' | jq '{\"dashboard \\\"Example\\\"\": [.[2]]}' | ./node_modules/json2yaml/cli.js > component_gallery\/examples\/\`echo '%' | jq '.[1]' -r | sed 's/ /_/g'\`.yml"

component_gallery/gallery.json: $(shell find src/components -name "gallery.json")
	cat $^ | jq -c " \
	  .[] | {\"example\": .examples | to_entries| .[], \"data\": .data, \"category\": .category} | \
	  {\"code\": {(.example.value): .data}, \"category\": .category, \"name\": .example.key} | \
	  [.category, .name, .code] \
	  " > $@
