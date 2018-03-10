component_gallery: component_gallery/examples component_gallery/component_gallery.md

component_gallery/component_gallery.md: component_gallery/gallery.json
	cat $^ | jq --slurp " \
	  group_by(.[0]) | \
	  .[] | [ \
		\"## \" + .[0][0], \
		([.[] | \
		  \"### \" + .[1], \
		  \"[Source](examples/\" + (.[1] | split(\" \") | join(\"_\")) + \".yml)\", \
		  \"\" \
		] | join(\"\n\") ), \
		\"\", \
		\"\"] \
	  | join(\"\n\")" -r > $@

component_gallery/examples: component_gallery/gallery.json
	cat $^ | tr "\n" "\0"| xargs -L1 -0 -n1 -I % bash -c "echo '%' | ./node_modules/json2yaml/cli.js > component_gallery\/examples\/\`echo '%' | jq '.[1]' -r | sed 's/ /_/g'\`.yml"

component_gallery/gallery.json: $(shell find src/components -name "gallery.json")
	cat $^ | jq -c " \
	  .[] | {\"example\": .examples | to_entries| .[], \"data\": .data, \"category\": .category} | \
	  {\"code\": {(.example.value): .data}, \"category\": .category, \"name\": .example.key} | \
	  [.category, .name, .code] \
	  " > $@
