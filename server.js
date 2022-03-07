
/*
if (process.env.NODE_ENV !== 'production') {
    const dotenv =require('dotenv').load()
  }
  
  STRIPES KEYS

*/
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
  const dotenv = require('dotenv');
  const express = require('express')
  const app = express()
  const fs = require('fs')
  const stripe = require('stripe')(stripeSecretKey)
  
  dotenv.config({path:'.env'})
  app.set('view engine', 'ejs')
  app.use(express.json())
  app.use(express.static('public'))
  

  //GET STORE ROUT
  app.get('/store', function(req, res) {
    fs.readFile('items.json', function(error, data) {
      if (error) {
        res.status(500).end()
      } else {
        res.render('store.ejs', {
          stripePublicKey: stripePublicKey,
          items: JSON.parse(data)
        })
      }
    })
  })
  

// PURCHASE ROUT
  app.post('/purchase', function(req, res) {
    fs.readFile('items.json', function(error, data) {
      if (error) {
        res.status(500).end()
      } else {
        const itemsJson = JSON.parse(data)
        const itemsArray = itemsJson.music.concat(itemsJson.merch)
        let total = 0
        req.body.items.forEach(function(item) {
          const itemJson = itemsArray.find(function(i) {
            return i.id == item.id
          })
          total = total + itemJson.price * item.quantity
        })
  
        stripe.charges.create({
          amount: total,
          source: req.body.stripeTokenId,
          currency: 'usd'
        }).then(function() {
          console.log('Charge Successful')
          res.json({ message: 'Successfully purchased items' })
        }).catch(function() {
          console.log('Charge Fail')
          res.status(500).end()
        })
      }
    })
  })
  
// LOCAL SERVER
  const PORT = process.env.port || 3000
  app.listen(PORT,()=>{
      console.log(`Server Run on http://localhost:${PORT}`);
  })
