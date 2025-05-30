import api from 'utils/api';

// --- Retry Utility with Exponential Backoff ---
const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.response?.status === 429 && i < retries - 1) {
        const waitTime = delay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
};

// --- Cache Utilities ---
const SEARCH_CACHE_PREFIX = 'search_cache_';
const SEARCH_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

const getCachedSearchResults = (cacheKey) => {
  const cached = localStorage.getItem(`${SEARCH_CACHE_PREFIX}${cacheKey}`);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > SEARCH_CACHE_DURATION) {
      localStorage.removeItem(`${SEARCH_CACHE_PREFIX}${cacheKey}`);
      return null;
    }
    return data;
  } catch (error) {
    localStorage.removeItem(`${SEARCH_CACHE_PREFIX}${cacheKey}`);
    return null;
  }
};

const setCachedSearchResults = (cacheKey, results) => {
  try {
    localStorage.setItem(
      `${SEARCH_CACHE_PREFIX}${cacheKey}`,
      JSON.stringify({ data: results, timestamp: Date.now() })
    );
  } catch (error) {
    console.warn('Failed to cache search results:', error);
  }
};

// --- Search APIs ---
const searchUsers = async (query) => {
  const req = retryWithBackoff(() =>
    api.get(`/userlist?${new URLSearchParams(query).toString()}`).then(({ data }) => data)
  );
  const { meta, data } = await req;
  return { meta, data: data.map((user) => ({ ...user, type: 'user' })) };
};

const searchPosts = async (query) => {
  const req = retryWithBackoff(() =>
    api.get(`/posts?${new URLSearchParams(query).toString()}`).then(({ data }) => data)
  );
  const { meta, data } = await req;
  if (!data) throw new Error('No data returned from searchPosts');
  return { meta, data: data.map((post) => ({ ...post, type: 'post' })) };
};

const searchHashtags = async (query) => {
  const hashtag = query.hashtag || '';
  const req = retryWithBackoff(() =>
    api
      .get(`/posts/hashtag/${encodeURIComponent(hashtag)}?${new URLSearchParams(query).toString()}`)
      .then(({ data }) => data)
  );
  const { meta, data } = await req;
  return { meta, data: data.map((hashtag) => ({ ...hashtag, type: 'hashtag' })) };
};

// --- Unified Search ---
const unifiedSearch = async (query, types = ['user', 'post', 'hashtag']) => {
  try {
    const cacheKey = `${JSON.stringify(query)}_${types.join('_')}`;
    const cachedResults = getCachedSearchResults(cacheKey);
    if (cachedResults) return cachedResults;

    const promises = [];
    if (types.includes('user')) promises.push(searchUsers(query));
    if (types.includes('post')) promises.push(searchPosts(query));
    if (types.includes('hashtag')) promises.push(searchHashtags(query));

    const results = await Promise.all(promises);

    const combinedData = results.flatMap((result) => result.data || []);
    const totalCount = results.reduce((sum, result) => sum + (result.meta.total || 0), 0);
    const lastPage = Math.ceil(totalCount / query.limit);

    const finalResults = {
      meta: {
        currentPage: query.page || 1,
        lastPage,
        total: totalCount,
        perPage: query.limit,
      },
      data: combinedData,
    };

    setCachedSearchResults(cacheKey, finalResults);
    return finalResults;
  } catch (error) {
    console.error('Unified search error:', error);
    throw error;
  }
};

// --- Exports ---
export { searchUsers, searchPosts, searchHashtags, unifiedSearch };
