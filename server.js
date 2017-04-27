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
	var d = new Date();
	var month=parseInt(d.getMonth())+1;
	req.body.Cdate=d.getDate()+"-"+month+"-"+d.getFullYear();
	req.body.likes=0;
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
	var d = new Date();
	var month=parseInt(d.getMonth())+1;
	req.body.Cdate=d.getDate()+"-"+month+"-"+d.getFullYear();	
	db.collection('quotes')
  .findOneAndUpdate({name: req.body.name}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote,
	  Cdate: req.body.Cdate
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
    res.send('Quote got deleted')
  })
})

app.put('/likes', (req, res) => {
	var newLikes;
	//var i=db.collection('quotes').findOne({name: 'Souvik'})
	console.log(req.body._id);
	console.log(req.body.likes);
	
	db.collection('quotes').findOne({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
	
	newLikes=result;
		console.log(newLikes);
    //res.send('Quote got deleted')
  })
	
	db.collection('quotes').update({name: req.body.name},{$set:{likes:req.body.likes+1}},
  (err, result) => {
    if (err) return res.send(500, err)
	
	console.log(result);
	res.send(result)
	//newLikes=result;
    //res.send('Quote got deleted')
  })
	
//	db.Lquotes.update({_id:req.body._id}, {$set:{likes:newLikes.likes+1}}, function(err, result) {
//    if (err)
//		return res.send(err)
//	
//     //do something.
//		console.log(result);
//	res.send(result)

	
/*	db.collection('Lquotes')
  .findOneAndUpdate({_id:req.body._id}, {
    $set: {
      _id: req.body._id,
      //quote: req.body.quote,
	  likes: req.body.likes+1
    }
  }, (err, result) => {
    if (err) return res.send(err)
    
	console.log(result);
	res.send(result)
  })*/
	
  
})