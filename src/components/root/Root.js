import * as d3 from "d3";

const RootComponent = (args) => (selection) => (data) => {
  if (!args.hasOwnProperty("title")) throw new Error("Title required")
  if (!(selection instanceof d3.selection)) throw new Error("A d3 selection is required")
  selection.select("title").text(args.title)
}

export default RootComponent
