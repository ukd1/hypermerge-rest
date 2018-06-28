const express = require('express')
const bodyParser = require('body-parser')
const Hypermerge = require('./hypermerge')
const createDocumentLink = require('./share-link')
const parseDocumentLink = require('./share-link')
const _shareLink = require('./share-link');
const app = express()


const HYPERMERGE_PATH = '/tmp/hypermerge' // shrug?
const hm = new Hypermerge({ storage: HYPERMERGE_PATH, port: 0 })

hm.once('ready', () => {
  hm.joinSwarm()
  app.use( bodyParser.json() )

  app.get('/', (req, res) => res.send('Server ready'))

  app.get('/:type/:hash/:crc', function (req, res) {
    pp_url = 'pushpin://' + req.params.type + '/' + req.params.hash + '/' + req.params.crc
    parsed = _shareLink.parseDocumentLink(pp_url)

    const handle = hm.openHandle(parsed.docId)

    res.set('X-PushPin-DocId', parsed.docId);
    res.set('X-PushPin-Ready', hm.readyIndex[parsed.docId])
    res.json(handle.get())
  })

  app.put('/:type/:hash/:crc', function (req, res) {
    pp_url = 'pushpin://' + req.params.type + '/' + req.params.hash + '/' + req.params.crc
    parsed = _shareLink.parseDocumentLink(pp_url)

    const handle = hm.openHandle(parsed.docId)

    handle.change((doc) => {
      doc.contents = req.body
    })

    res.set('X-PushPin-DocId', parsed.docId);
    res.json(handle.get())
  })

  app.post('/:type', function (req, res) {
    const doc = hm.create()
    const docId = hm.getId(doc)
    const handle = hm.openHandle(docId)

    console.log(req.params.type, req.body)

    handle.change((doc) => {
      doc.contents = req.body
    })

    var link = _shareLink.createDocumentLink(req.params.type, docId)

    res.set('X-PushPin-DocId', docId);
    res.set('X-PushPin-Link', link);
    res.json(req.body)
  })

  port = process.env.PORT || 3000
  app.listen(port, () => console.log('HyperMerge REST listening on port ' + port + '!'))
})
