const Parser = require("rss-parser");
const parser = new Parser();

const feeds = [
  "https://feeds.feedburner.com/TechCrunch/",
  "https://www.theverge.com/rss/index.xml",
  "https://dev.to/feed",
  "https://www.wired.com/feed/rss"
];

const fetchTechNews = async () => {
  const articles = [];

  for (const feedUrl of feeds) {
    const feed = await parser.parseURL(feedUrl);
    feed.items.slice(0, 5).forEach(item => {
      articles.push({
        title: item.title,
        link: item.link,
     description: item.contentSnippet?.slice(0, 420) + "...",
        source: feed.title,
        publishedAt: item.pubDate
      });
    });
  }

  return articles;
};

module.exports = { fetchTechNews };
