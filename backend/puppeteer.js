// const template = require('./template');
// const puppeteer = require('puppeteer');
// const url = require('url');

// exports.generateImage = async function (req, res) {
//   try {
//     const queryObject = url.parse(req.query.url, true).query;
//     const { title, content, imageUrl } = queryObject;

//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.setViewport({ width: 1200, height: 630 });

//     const htmlContent = template.getHtml(decodeURIComponent(title), decodeURIComponent(content), decodeURIComponent(imageUrl));
//     await page.setContent(htmlContent);

//     const image = await page.screenshot({ type: 'jpeg' });

//     await browser.close();

//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'image/jpeg');
//     res.setHeader('Cache-Control', 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000');
//     res.end(image);
//   } catch (error) {
//     console.error('Error generating image:', error);
//     res.statusCode = 500;
//     res.json({ error: 'Failed to generate image' });
//   }
// };

const template = require('./template');
const puppeteer = require('puppeteer-core'); // Use puppeteer-core instead of puppeteer
const url = require('url');

// Define the path to the Chrome executable in Render
const CHROME_EXECUTABLE_PATH = '/opt/render/.cache/puppeteer/chrome';

exports.generateImage = async function (req, res) {
  try {
    const queryObject = url.parse(req.query.url, true).query;
    const { title, content, imageUrl } = queryObject;

    const browser = await puppeteer.launch({
      executablePath: CHROME_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });

    const htmlContent = template.getHtml(decodeURIComponent(title), decodeURIComponent(content), decodeURIComponent(imageUrl));
    await page.setContent(htmlContent);

    const image = await page.screenshot({ type: 'jpeg' });

    await browser.close();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000');
    res.end(image);
  } catch (error) {
    console.error('Error generating image:', error);
    res.statusCode = 500;
    res.json({ error: 'Failed to generate image' });
  }
};
