import * as d3 from 'd3'

const loaders = {

  'tsv': (path, callback, file_loader, is_file) => {
    if (!is_file) {
      d3.tsv(path, callback)
    } else {
      file_loader(path, (_, data) => callback(undefined, d3.tsvParse(data)))
    }
  },

  'csv': (path, callback, file_loader, is_file) => {
    if (!is_file) {
      d3.csv(path, callback)
    } else {
      file_loader(path, (_, data) => callback(undefined, d3.csvParse(data)))
    }
  },

  'text': (path, callback, file_loader, is_file) => {
    if (!is_file) {
      d3.text(path, callback)
    } else {
      file_loader(path, callback)
    }
  },

  'json': (path, callback, file_loader, is_file) => {
    if (!is_file) {
      d3.json(path, callback)
    } else {
      file_loader(path, (_, data) => callback(undefined, JSON.parse(data)))
    }
  },

}

const loader_exists = (loader_name) =>
  loaders[loader_name] !== undefined

const with_loader = (loader_name, file_loader, is_file) =>
  (source) => (callback) => {
    if (!loader_exists(loader_name)) throw new Error('Invalid loader')
    loaders[loader_name](source, callback, file_loader, is_file)
  }

export default with_loader
