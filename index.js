'use strict'

var net = require('net')

module.exports = function getPort (done) {

  var server = net.createServer()
    .listen(0, function () {
      var address = server.address()
      server.once('close', function () {
        done(address.port)
      })
      server.close()
    })
    .on('error', function (err) {
      if (err.code === 'EACCES') getPort(done)
      else throw err
    })
}
