docs: docs/examples docs/components.md docs/screenshots


docs/screenshots: docs/gallery.json
	cat $^ | tr "\n" "\0"| xargs -L1 -0 -n1 -I % bash -c "make docs\/screenshots\/\`echo '%' | jq '.[1]' -r | sed 's/ /_/g'\`.png"

docs/screenshots/%.png: docs/examples/%.js
	rm -f src/_temp.js
	cp $< src/_temp.js
	bash -c "npx webpack src/_temp.js --output-filename screenshot_index.js --config webpack.screenshot.config.js"
	node ./src/screenshot.js $@
	rm -f src/_temp.js

docs/_includes/examples.html: docs/examples
	ls $^ | \
	grep -e '\.yml$$' | \
	sed 's \.yml$$  ' | \
	sed 's \(.*\) <option\ value="\1.yml">\1</option> ' \
	> $@

docs/examples/%.md: ./docs/examples/%.yml
	echo "---" > $@
	echo "layout: default" >> $@
	echo "title: How to use $*" | sed 's/_/ /g' >> $@
	echo "---" >> $@
	echo "" >> $@
	echo "# How to use $*" | sed 's/_/ /g' >> $@
	echo "Here's an example code regarding the use of $*: " | sed 's/_/ /g' >> $@
	echo "" >> $@
	echo "\`\`\`yaml" >> $@
	cat $^ | sed '1,1d' | sed 's/^  //' >> $@
	echo "\`\`\`" >> $@
	echo "The code above will render a $* that looks like this:" | sed 's/_/ /g' >> $@
	echo "" >> $@
	echo "![](../screenshots/$*.png)" >> $@
	echo "" >> $@
	echo "## JSON format" >> $@
	echo "The YAML above is equivalent to this JSON:" >> $@
	echo "\`\`\`json" >> $@
	cat $^ | npx babel-node scripts/compile_yaml_to_json >> $@
	echo "\`\`\`" >> $@

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
	bash -c 'echo "# Components" > $@'
	cat $^ | jq --slurp " \
	  group_by(.[0]) | \
	  .[] | [ \
		\"## \" + .[0][0], \
		\"\", \
		\"<div class=\\\"gallery-category\\\" markdown=\\\"1\\\">\", \
		\"\", \
		([.[] | \
		  \"\", \
		  \"<div class=\\\"gallery-item\\\"  markdown=\\\"1\\\">\", \
		  \"\", \
		  \"### \" + .[1] + \
			\" ([Usage](examples/\" + (.[1] | split(\" \") | join(\"_\")) + \"))\", \
		  \"![](screenshots/\" + (.[1] | split(\" \") | join(\"_\")) +  \".png)\", \
		  \"\", \
		  \"</div>\", \
		  \"\" \
		] | join(\"\n\") ), \
		\"\", \
		\"</div>\", \
		\"\", \
		\"\"] \
	  | join(\"\n\")" -r >> $@

docs/examples: docs/gallery.json
	cat $^ | tr "\n" "\0"| xargs -L1 -0 -n1 -I % bash -c "echo '%' | jq '{\"dashboard \\\"Example\\\"\": [.[2]]}' | ./node_modules/json2yaml/cli.js > docs\/examples\/\`echo '%' | jq '.[1]' -r | sed 's/ /_/g'\`.yml"
	cat $^ | tr "\n" "\0"| xargs -L1 -0 -n1 -I % bash -c "make docs\/examples\/\`echo '%' | jq '.[1]' -r | sed 's/ /_/g'\`.md"

docs/gallery.json: $(shell find src/components -name "gallery.json")
	cat $^ | jq -c " \
	  .[] | {\"example\": .examples | to_entries| .[], \"data\": .data, \"category\": .category} | \
	  {\"code\": {(.example.value): .data}, \"category\": .category, \"name\": .example.key} | \
	  [.category, .name, .code] \
	  " > $@
