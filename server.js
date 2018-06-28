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

  app.get('/', (req, res) => res.send(`

    <script type="text/javascript">
    navigator.registerProtocolHandler("web+pushpin", "//" + window.location.host + "/redirect?q=%s", "HyperMerge REST");
    </script>

    <h1>HyperMerge REST</h1>

    <p>Note, you can accept this as a place to open web+pushpin:// links. Then this should work:</p>
    <p><a href="web+pushpin://some-type/9ahVrn5UZuMusdacs8xsFE2HCtmWfC9R1z4xpAi2AjBY/6Dm">web+pushpin://some-type/9ahVrn5UZuMusdacs8xsFE2HCtmWfC9R1z4xpAi2AjBY/6Dm</a></p>

    <p>Checkout the docs: <a href="https://github.com/ukd1/hypermerge-rest">https://github.com/ukd1/hypermerge-rest</a></p>

    `))

  app.get('/redirect', function (req, res) {
    res.send('test' + req.params)
  })

  app.get('/:type/:hash/:crc', function (req, res) {
    pp_url = 'pushpin://' + req.params.type + '/' + req.params.hash + '/' + req.params.crc
    parsed = _shareLink.parseDocumentLink(pp_url)

    const handle = hm.openHandle(parsed.docId)

    res.set('X-PushPin-DocId', parsed.docId);
    res.set('X-PushPin-Ready', hm.readyIndex[parsed.docId])

    doc = handle.get()

    if (doc) {
      res.json(doc.contents)
    } else {
      res.status(202)
    }
  })

  app.put('/:type/:hash/:crc', function (req, res) {
    pp_url = 'pushpin://' + req.params.type + '/' + req.params.hash + '/' + req.params.crc
    parsed = _shareLink.parseDocumentLink(pp_url)

    const handle = hm.openHandle(parsed.docId)

    handle.change((doc) => {
      doc.contents = req.body
    })

    res.set('X-PushPin-DocId', parsed.docId);
    res.json(req.body)
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
