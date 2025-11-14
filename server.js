import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/css', express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let articles = [
  { id: 1, title: 'Welcome to HW8B', content: 'Intro content' },
  { id: 2, title: 'Second Article', content: 'More content' }
];


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/ex1', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ex1.html'));
});

app.post('/submit', (req, res) => {
  const { name, email, payment, promotions, location } = req.body || {};
  const safeName = String(name || '').trim();
  const safeEmail = String(email || '').trim();
  const safePayment = String(payment || '').trim();
  const wantsPromotions = promotions === 'yes';
  const preferredLocation = String(location || '').trim();

  res.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="/css/style.css">
    <title>Form Submitted</title>
  </head>
  <body>
    <div class="container">
      <p><a href="/">Link to Start Page</a></p>
      <h1>Ansh's Sample Form</h1>
      <form action="/submit" method="post" class="card" id="contactForm">
        <label for="name">Name:</label>
        <input id="name" name="name" type="text" value="${escapeHtml(safeName)}" required />

        <label for="email">Email:</label>
        <input id="email" name="email" type="email" value="${escapeHtml(safeEmail)}" required />

        <label>Payment Type:</label>
        <div>
          <input type="radio" id="paymentCash" name="payment" value="Cash" ${safePayment === 'Cash' ? 'checked' : ''} />
          <label for="paymentCash">Cash</label>
        </div>
        <div>
          <input type="radio" id="paymentCredit" name="payment" value="Credit Card" ${safePayment === 'Credit Card' ? 'checked' : ''} />
          <label for="paymentCredit">Credit Card</label>
        </div>
        <div>
          <input type="radio" id="paymentGoogle" name="payment" value="Google Pay" ${safePayment === 'Google Pay' ? 'checked' : ''} />
          <label for="paymentGoogle">Google Pay</label>
        </div>
        <div>
          <input type="radio" id="paymentApple" name="payment" value="Apple Pay" ${safePayment === 'Apple Pay' ? 'checked' : ''} />
          <label for="paymentApple">Apple Pay</label>
        </div>

        <div style="margin-top: 8px;">
          <input type="checkbox" id="promotions" name="promotions" value="yes" ${wantsPromotions ? 'checked' : ''} />
          <label for="promotions">Sign me up for special promotions</label>
        </div>

        <label for="location" style="margin-top: 8px;">Preferred Location:</label>
        <select id="location" name="location">
          <option ${preferredLocation === 'Orange County' ? 'selected' : ''}>Orange County</option>
          <option ${preferredLocation === 'Los Angeles County' ? 'selected' : ''}>Los Angeles County</option>
          <option ${preferredLocation === 'San Diego County' ? 'selected' : ''}>San Diego County</option>
        </select>

        <button type="submit">Submit</button>
        <button type="reset">Cancel</button>
      </form>
      <p>${escapeHtml(safeName)}, Thank you for your order. We will keep you posted on delivery status at ${escapeHtml(safeEmail)}.</p>
      <p><a href="/ex1">Back to form</a></p>
    </div>
  </body>
</html>`);
});


app.get('/ex2', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ex2.html'));
});

app.post('/api/countries', (req, res) => {
  const { name, countries } = req.body || {};
  if (typeof name !== 'string' || !Array.isArray(countries)) {
    return res.status(400).json({ message: 'Invalid payload. Expect { name: string, countries: string[] }' });
  }
  const list = countries.map(c => String(c).trim()).filter(Boolean);
  res.json({
    message: `Your name is ${name} and you visited ${list.length} countries. Keep traveling!`
  });
});


app.get('/ex3', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ex3.html'));
});

app.post('/articles', (req, res) => {
  const { title, content } = req.body || {};
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: 'Title is required' });
  }
  const newId = articles.length ? Math.max(...articles.map(a => a.id)) + 1 : 1;
  const newArticle = {
    id: newId,
    title: title.trim(),
    content: (content || '').toString().trim()
  };
  articles.push(newArticle);

  return res.send(`<!doctype html>
<html lang="en">
  <head>
  
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="/css/style.css">
    <title>Article Created</title>
  </head>
  <body>
    <div class="container">
      <p><a href="/">Link to Start Page</a></p>
      <h1>Ansh's Articles/Form Solution</h1>
      <h2>Add new article</h2>
      <p>New article added successfully with title "<strong>${escapeHtml(newArticle.title)}</strong>" and ID <strong>${newArticle.id}</strong>!</p>
      <p><a href="/ex3">Back</a></p>
    </div>
  </body>
</html>`);
});

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, s => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[s]);
}

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


