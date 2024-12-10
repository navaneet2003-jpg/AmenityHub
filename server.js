const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
let city = null;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', async (req, res) => {
  city = req.body.city;

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.google.com/maps/search/restaurant+'+city+'/@15.3593758,75.1428627,15z/data=!3m1!4b1?entry=ttu');
    const page2 = await browser.newPage();
    await page2.goto('https://www.google.com/maps/search/hospital+'+city+'/@15.3593758,75.1428627,15z/data=!3m1!4b1?entry=ttu');

    res.send(`Search results for ${city}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while processing request');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});