const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl.js')
const app = express()
const url = "mongodb+srv://jkjerryomalloor:mongoConnect@cluster0.xblw4h2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = (url) => {
  mongoose.set('strictQuery', true);
  mongoose.connect(url)
    .then(() => console.log('connected to mongo'))
    .catch((err) => {
      console.error('failed to connect with mongo');
      console.error(err);
    });
};

const startServer = async () => {
  try {
    connectDB(url);
    app.listen(8080, () => console.log('Server started on port 8080'));
  } catch (error) {
    console.log(error);
  }
};

startServer();


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})
