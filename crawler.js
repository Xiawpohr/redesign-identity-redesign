const HCCrawler = require('headless-chrome-crawler')
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://redesign-identity-redesign.firebaseio.com'
})

const db = admin.firestore()
const baseUrl = 'https://identityredesign.tw/work.html'

function fullUrlOf (asset) {
  return `${baseUrl}/${asset}`
}

function identityUrlById (id) {
  return `${baseUrl}?work_id=${id}`
}

async function scrape () {
  const crawler = await HCCrawler.launch({
    evaluatePage: () => {
      const NUMBER_SELECTER = '#vue > div.topic > div.topic-header > div.topic-author > div.number'  // ex: 作品編號 #260
      const SUBJECT_SELECTER = '#vue > div.topic > div.topic-header > h1'
      const CONTENT_SELECTER = '#vue > div.topic > div.topic-content'
      const IMAGES_SELECTER = '#vue > div.topic > div.topic-header > img.topic-image'
      const AUTHOR_NAME_SELECTER = '#vue > div.topic > div.topic-header > div.topic-author > div.author > div.name'
      const AUTHOR_AVATAR_SELECTER = '#vue > div.topic > div.topic-header > div.topic-author > div.avatar' // ex: url(https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/28378023_10216276424808515_2058067692348721094_n.jpg?_nc_cat=0&oh=00d86cd7dfc65c8dd44c5a895f852871&oe=5B735D36)

      const number = $(NUMBER_SELECTER).text().substr(6)
      const subject = $(SUBJECT_SELECTER).text()
      const content = $(CONTENT_SELECTER).text()
      const imageNames = $(IMAGES_SELECTER).map((i, el) => {
        return $(el).attr('src')
      }).get()
      const authorName = $(AUTHOR_NAME_SELECTER).text()
      const authorAvatar = $(AUTHOR_AVATAR_SELECTER).css('backgroundImage').split('"')[1]

      return number ? {
        hasData: true,
        number, subject, content, imageNames, authorName, authorAvatar
      } : {
        hasData: false
      }
    },
    onSuccess (result) {
      if (result.response.ok && result.result.hasData) {
        const data = {
          number: result.result.number,
          subject: result.result.subject,
          content: result.result.content,
          imageUrls: result.result.imageNames.map(imageName => fullUrlOf(imageName)),
          authorName: result.result.authorName,
          authorAvatar: result.result.authorAvatar
        }
        db.collection('topic').doc(data.number).set(data)
      }
    },
    onError (error) {
      console.log('Error in this link, ', error.options.url)
    }
  })

  async function processQueues (urls) {
    for (const url of urls) {
      await crawler.queue(url)
    }
  }

  const queuedUrls = Array.from(Array(1050), (v, i) => i + 1)
                          .map(id => identityUrlById(id))

  await processQueues(queuedUrls).catch(err => console.log(err))
  await crawler.onIdle()
  await crawler.close()
}

scrape()
