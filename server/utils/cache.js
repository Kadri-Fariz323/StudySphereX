let cache = {
  data: null,
  lastFetch: null
};

const getCache = () => cache;

const setCache = (data) => {
  cache.data = data;
  cache.lastFetch = Date.now();
};

module.exports = { getCache, setCache };
