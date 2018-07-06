import * as functions from 'firebase-functions'
import { Nuxt } from 'nuxt'
import * as express from 'express'

const app = express()

const config = {
  debug: true, // stage debug
  dev: false,
  buildDir: 'nuxt',
  build: {
    publicPath: '/'
  }
}

const nuxt = new Nuxt(config)

function handleRequest (req, res) {
  res.set('Cache-Control', 'public, max-age=600, s-maxage=1200')
  return nuxt.render(req, res)
}

app.use(handleRequest);

export const ssrapp = functions.https.onRequest(app)
