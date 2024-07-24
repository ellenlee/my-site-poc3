const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const NOTION_API_KEY = 'secret_Xv7beEVk5MT9h4a4luw8xG2KMSs5WLR5IploA0Ji47o'; // 替換為你的 Notion API 密鑰
const DATABASE_ID = '73b494f299a249fbaf6bb5acdeb8d0e7';

app.get('/notion-articles', async (req, res) => {
  try {
      console.log("Fetching data from Notion API...");
      const response = await axios.post(
          `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
          {
              filter: {
                  property: "Status",
                  status: {
                      equals: "Publish"
                  }
              }
          },
          {
              headers: {
                  'Authorization': `Bearer ${NOTION_API_KEY}`,
                  'Content-Type': 'application/json',
                  'Notion-Version': '2022-06-28',
              },
          }
      );
      console.log("Data fetched from Notion API:", response.data);

      const articles = response.data.results.map(page => {
          console.log('Processing page:', page);
          const title = page.properties?.Title?.title?.[0]?.text?.content || 'No Title';
          const description = page.properties?.Author?.rich_text?.[0]?.text?.content || 'No Description';
          const url = page.url;
          const date = page.properties?.Tags?.date?.start || '';

          console.log(`Article ID: ${page.id}`);
          console.log(`Title: ${title}`);
          console.log(`Description: ${description}`);
          console.log(`URL: ${url}`);
          console.log(`Date: ${date}`);

          return {
              id: page.id,
              title: title,
              description: description,
              url: url,
              date: date
          };
      });

      res.json(articles);
  } catch (error) {
      console.error("Error fetching data from Notion API:", error);
      res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});