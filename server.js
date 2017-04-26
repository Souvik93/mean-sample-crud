const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyParser.json());
//var port_number = server.listen(process.env.PORT || 3000);
//app.listen(port_number);
var db
app.set('view engine', 'ejs');
//mongodb://localhost:27017/exampleDb
//mongodb://souvik:password@ds117271.mlab.com:17271/souvik
MongoClient.connect('mongodb://souvik:password@ds117271.mlab.com:17271/souvik', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000,() => {
    console.log('listening on 3000')
  })
})
app.post('/quotes', (req, res) => {
	var d = new Date("2011-04-20");
	
	req.body.Cdate=d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear();
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
  
})
/*app.get('/', (req, res) => {
  db.collection('quotes').find().toArray(function(err, results) {
 // console.log(results)
  res.render('index.ejs', {quotes: result});
  
  // send HTML file populated with quotes here
})
	//console.log(cursor);
})*/

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {quotes: result})
  })
})

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: req.body.name}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})