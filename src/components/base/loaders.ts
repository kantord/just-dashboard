import * as d3 from 'd3'
import type { FileLoader } from '../../types'

type LoaderCallback = (error: unknown, data: unknown) => void

type LoaderFunction = (
  path: string,
  callback: LoaderCallback,
  file_loader: FileLoader,
  is_file: boolean
) => void

const loaders: Record<string, LoaderFunction> = {

  'tsv': (path, callback, file_loader, is_file) => {
    if (!is_file) {
      d3.tsv(path, callback as any)
    } else {
      file_loader(path, (_, data) => callback(undefined, d3.tsvParse(data)))
    }
  },

  'csv': (path, callback, file_loader, is_file) => {
    if (!is_file) {
      d3.csv(path, callback as any)
    } else {
      file_loader(path, (_, data) => callback(undefined, d3.csvParse(data)))
    }
  },

  'text': (path, callback, file_loader, is_file) => {
    if (!is_file) {
      d3.text(path, callback as any)
    } else {
      file_loader(path, callback as any)
    }
  },

  'json': (path, callback, file_loader, is_file) => {
    if (!is_file) {
      d3.json(path, callback as any)
    } else {
      file_loader(path, (_, data) => callback(undefined, JSON.parse(data)))
    }
  },

}

const loader_exists = (loader_name: string): boolean =>
  loaders[loader_name] !== undefined

const with_loader = (loader_name: string, file_loader: FileLoader, is_file: boolean) =>
  (source: string) => (callback: LoaderCallback) => {
    if (!loader_exists(loader_name)) throw new Error('Invalid loader')
    loaders[loader_name](source, callback, file_loader, is_file)
  }

export default with_loader
