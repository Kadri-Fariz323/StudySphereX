const express = require("express");
const { fetchTechNews } = require("../helpers/rssService");
const { getCache, setCache } = require("../utils/cache");

const router = express.Router();

router.get("/tech-news", async (req, res) => {
  const cache = getCache();

  // 30 minutes cache
  if (cache.data && Date.now() - cache.lastFetch < 30 * 60 * 1000) {
    return res.json({ source: "cache", data: cache.data });
  }

  const news = await fetchTechNews();
  setCache(news);

  res.json({ source: "live", data: news });
});

module.exports = router;
