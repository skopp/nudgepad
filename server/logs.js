site.get('/nudgepad.logs', nudgepad.checkId, function(req, res, next) {

  exec('tail ' + nudgepad.paths.site + 'logs/mon.txt', function (error, stdout, stderr) {
    res.set('Content-Type', 'text/plain')
    res.send(stdout)
  })
  
})
