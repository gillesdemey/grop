# GROP — Get Random Open Port

Returns a random open port on the host machine

## Usage

```javascript
var grop = require('grop')

grop(function (port) {
  console.log('Available port: %d', port)
})
```
