# Hypermerge REST

This is a (shitty, un-tested) way to read, write and update things in Hypermerge via REST. It only supports reading JSON as...express.js / body-parsers / it's late.

## Installing

```
yarn
node index.js
```

## Usage

### Create
POST something:

```bash
curl -vd '{"some_setting": true}' -H 'Content-Type: application/json' http://localhost:3000/some-type
```

You should get back (in the headers - a link, plus the docId):
```
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 3000 (#0)
> POST /some-type HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.54.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 22
> 
* upload completely sent off: 22 out of 22 bytes
< HTTP/1.1 200 OK
< X-Powered-By: Express
< X-PushPin-DocId: cfd53cce75ba0acdf5f48dfe25b774debe676b286502900b584ddf05d55e9d4b
< X-PushPin-Link: pushpin://some-type/EzHywj2aJsMXKg6JvhzGjWbMghp81JF2xuZ5H6T12MX8/JKM
< Content-Type: application/json; charset=utf-8
< Content-Length: 21
< ETag: W/"15-Tj6CtNs1faGDQKwzpyEgbRqj8+A"
< Date: Thu, 28 Jun 2018 07:25:42 GMT
< Connection: keep-alive
< 
* Connection #0 to host localhost left intact
{"some_setting":true}
```

### Update

```bash
curl -X PUT -v -d '{"some_setting": false}' http://localhost:3000/some-type/9ahVrn5UZuMusdacs8xsFE2HCtmWfC9R1z4xpAi2AjBY/6Dm
```

