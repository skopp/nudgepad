// Persona Login
site.post('/nudgepad.persona', function(req, res, next) {
  
  var assertion = req.body.assertion
  
  superagent
    .post('https://verifier.login.persona.org/verify')
    .send({ assertion: assertion, audience: 'http://' + nudgepad.domain })
    .end(function(error, result){
      
      if (error)
        return res.send(error)
  
      var email = result.body.email
      
      var worker = nudgepad.site.get('workers ' + email)

      if (!worker)
        return res.send('No user with email ' + email)
      
      // Login successful!
      res.cookie('email', email, { expires: new Date(Date.now() + 5184000000)})
      res.cookie('key', worker.get('key'), { expires: new Date(Date.now() + 5184000000)})
      res.cookie('name', worker.get('name'), { expires: new Date(Date.now() + 5184000000)})
      res.redirect('/nudgepad')
      
    })
})

