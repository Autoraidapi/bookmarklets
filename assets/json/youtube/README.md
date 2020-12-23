Oddity here is when the `video.currentSrc` proxy is opened from a bookmark and decoded into the new window on the users device. The activity *looks* like `sed`.

```
Request URL:https://m.youtube.com/youtubei/v1/log_event?alt=json&key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8
Request Method:POST
Status Code:200 OK200 OK
```

--------------------------
Request Headers : [source]
--------------------------
```
Accept-Language:en-US,en;q=0.8
Content-Type:application/json
Cookie:VISITOR_INFO1_LIVE=ceUevLbiocE; YSC=lB7uNOUakfk; GPS=1
Origin:https://m.youtube.com
Referer:https://m.youtube.com/watch?v=SsKT0s5J8ko
User-Agent:Mozilla/5.0 (BB10; Kbd) AppleWebKit/537.35+ (KHTML, like Gecko) Version/10.3.3.3216 Mobile Safari/537.35+
X-Goog-Visitor-Id:CgtjZVVldkxiaW9jRSjzn9D8BQ%3D%3D
X-YouTube-Ad-Signals:dt=1603538932508&flash=0&frm&u_tz=-420&u_his=3&u_java&u_h=391&u_w=391&u_ah=391&u_aw=391&u_cd=24&u_nplug&u_nmime&bc=1&bih=374&biw=390&brdim=0%2C0%2C0%2C0%2C391%2C0%2C390%2C374%2C390%2C374&vis=2&wgl=true&ca_type=image&bid=ANyPxKq45GjcfnBA1yUEf6_22Fjs6jsEbC5SpmskbePATb_Mucsbc_J87Gd6WvFnlt3GFvNnTL7b10DS6oJeB-zRUwRB_cSllA
X-YouTube-Client-Name:2
X-YouTube-Client-Version:2.20201023.02.00
X-YouTube-Device:cbr=Safari+Mobile&cbrand=blackberry&cbrver=10.3.3.3216&ceng=WebKit&cengver=537.35%2B&cmodel=kbd&cos=BlackBerry&cosver=10.3.3.3216&cplatform=MOBILE
X-YouTube-Page-CL:338239199
X-YouTube-Page-Label:youtube.mobile.web.client_20201021_02_RC00
X-YouTube-Utc-Offset:-420
X-YouTube-Variants-Checksum:fed2364c62a91d12d078aff1dfed6fba
```

------------------------------------------------
Query String Parameters : [source | URL encoded]
------------------------------------------------
```
alt:json
key:AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8
```

--------------------------
Request Payload : [source]
--------------------------
```
context : {
	client : {
		browserName: "Safari Mobile"
		browserVersion: "10.3.3.3216"
		clientName: 2
		clientVersion: "2.20201023.02.00"
		deviceMake: "blackberry"
		deviceModel: "kbd"
		gl: "CA"
		hl: "en"
		osName: "BlackBerry"
		osVersion: "10.3.3.3216"
		platform: "MOBILE"
		screenDensityFloat: "1.84375"
	}
}
```

```
Events : [
	context : {lastActivityMs: "66009"}
	eventTimeMs: 1603539008356
]
```

```
ht5PlayerHealthEvent
hasDrm: false
isAd: false
isGapless: false
joinLatencySecs: 2.2070000000000007
liveMode: "LIVE_STREAM_MODE_UNKNOWN"
networkErrorCount: 0
nonNetworkErrorCount: 0
playTimeSecs: 32.494
playerCanaryType: "HTML5_PLAYER_CANARY_TYPE_UNSPECIFIED"
rebufferTimeSecs: 0
seekCount: 0
started: true
stateAtSend: "PLAYER_PLAYBACK_STATE_PAUSED"

requestTimeMs: "1603539018430"

clientCounter: "9454"
serializedEventId: "8w-UX6TIHYmkkwbrspSYDQ"
```

---------------------------
Response Headers : [source]
---------------------------

```
Alt-Svc:h3-Q050=":443"; ma=2592000,h3-29=":443"; ma=2592000,h3-T051=":443"; ma=2592000,h3-T050=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,quic=":443"; ma=2592000; v="46,43"
Cache-Control:private
Content-Encoding:gzip
Content-Type:application/json; charset=UTF-8
Date:Sat, 24 Oct 2020 11:30:18 GMT
Server:ESF
Transfer-Encoding:chunked
Vary:Origin, X-Origin, Referer
X-Content-Type-Options:nosniff
X-Frame-Options:SAMEORIGIN
X-XSS-Protection:0
```

--------------------------
URL From Device : [parsed]
--------------------------

```javascript
Object {
  c: "mweb",
  clen: "16341321",
  cpn: "ukmmoxgptdjeufqw",
  cver: "2.20201023.02.00",
  dur: "347.254",
  ei: "lbmux-6wcopckgbyglsgca",
  expire: "1603562892",
  fvip: "2",
  gir: "yes",
  id: "o-ahbi3xrpydsnzvcj1mhu1ckyjbx4gq9bierd0nnrjiry",
  initcwndbps: "2031250",
  ip: "184.66.246.24",
  itag: "18",
  lmt: "1580005417279870",
  lsig: "ag3c_xawrqigyqaxzf_fqb7hurh7dzqoog2tr1lswycfu08ifchybmyciqcqr1cosmiuju2ojz6wpnmh_mpombrc2hmoxjefv8jckg%3d%3d",
  lsparams: "mh%2cmm%2cmn%2cms%2cmv%2cmvi%2cpl%2cinitcwndbps",
  mh: "um",
  mime: "video%2fmp4",
  mm: "31%2c26",
  mn: "sn-ni5f-t8gs%2csn-vgqs7nes",
  ms: "au%2conr",
  mt: "1603541204",
  mv: "m",
  mvi: "2",
  oid: "ybgwgciucoauepqgy_acmw",
  pl: "22",
  pltype: "content",
  ptchn: "3sevbyhullc-aaembeqflg",
  ptk: "youtube_single",
  ratebypass: "yes",
  requiressl: "yes",
  sig: "aoq0qj8wrgihapb0frpuyzkxwt5xajesey-djzchwyagvs7scwwazjdoaiea3v_iiur2k--sjpcg-hpa5ano1rj71tbdfko0ndyyhja%3d",
  source: "youtube",
  sparams: "expire%2cei%2cip%2cid%2citag%2csource%2crequiressl%2cvprv%2cmime%2cgir%2cclen%2cratebypass%2cdur%2clmt",
  txp: "5531432",
  vprv: "1"
}
```
