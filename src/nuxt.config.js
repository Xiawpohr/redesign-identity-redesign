module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'redesign-identity-redesign',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Redesign the vote flow of the event, Identity Redesign, to a more fair mechanism.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  buildDir: '../functions/nuxt',
  build: {
    publicPath: '/',
    extractCSS: true,
    babel: {
      presets: [
        'env',
        'stage-0'
      ],
      plugins: [
        ['transform-runtime', {
          'polyfill': true,
          'regenerator': true
        }]
      ]
    },
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
