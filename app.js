const app = require('express')()
const bodyParser = require('body-parser')
const validator = require('validator')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

const port = 8080

app.use(bodyParser.urlencoded({ extended: true }))
db.defaults({ emails: [] }).write()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/addEmail', (req, res) => 
{
	var email = req.body.email
	if (!validator.isEmail(email))
	{
		res.status(400).send('Invalid email').end()
	}
	else if (db.get('emails').includes(email).value()) 
	{
		res.status(400).send('Duplicate email').end()
	} 
	else 
	{
		db.get('emails').push(email).write()
		res.status(200).send("Success").end()
	}
})

app.get('/api/getEmails', (req, res) => 
{
	res.end(db.get('emails').value().join(', '))
})

app.listen(port, () => 
{
	console.log("Server started on port " + port)
})