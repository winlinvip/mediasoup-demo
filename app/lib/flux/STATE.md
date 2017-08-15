# APP STATE

```js
{
  room :
  {
    id    : 'wqetr6yqe',
    state : 'connected' // new/connecting/connected/disconnected/closed
  },
  me :
  {
    name             : 'bob',
    device           : 'Firefox 61',
    webcamInProgress : false,
    producers        : [ 1111, 1112 ] // TODO: REMOVE
  },
  producers :
  {
    '1111' :
    {
      id             : 1111,
      source         : 'mic', // mic/webcam
      locallyPaused  : true,
      remotelyPaused : false
    },
    '1112' :
    {
      id             : 1112,
      source         : 'webcam', // mic/webcam
      deviceLabel    : 'Macbook Webcam',
      type           : 'front', // front/back
      resolution     : 'vga', // qvga/vga/hd
      locallyPaused  : false,
      remotelyPaused : false,
      track          : MediaStreamTrack
    }
  },
  peers :
  {
    'alice' :
    {
      name        : 'alice',
      device    : 'Chrome 59',
      consumers : [ 5551, 5552 ]
    }
  },
  consumers :
  {
    '5551' :
    {
      id             : 5551,
      peerName       : 'alice',
      source         : 'mic', // mic/webcam
      deviceLabel    : 'Default Microphone',
      locallyPaused  : false,
      remotelyPaused : false,
      track          : MediaStreamTrack
    },
    '5552' :
    {
      id             : 5552,
      peerName       : 'alice',
      source         : 'webcam',
      deviceLabel    : 'HP Webcam Pro',
      locallyPaused  : false,
      remotelyPaused : true,
      track          : MediaStreamTrack
    }
  }
}
```
