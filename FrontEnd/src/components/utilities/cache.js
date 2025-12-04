import axios from "axios";

const CACHE_PREFIX = 'app_cache_';

export const getCachedData = async (url, config = {}) => {
  const cacheKey = `${CACHE_PREFIX}${url}`;
  
  const stored = localStorage.getItem(cacheKey);
  if (stored) {
    const { data, timestamp } = JSON.parse(stored);
    const age = Date.now() - timestamp;
    const ttl = config.cacheTTL || 5 * 60 * 1000; 
    
    if (age < ttl) {
      // console.log('Cache da localStorage:', cacheKey);
      return data;
    } else {
      localStorage.removeItem(cacheKey); 
    }
  }
  

  // console.log('🌐 Richiesta al server:', url);
  try {
    const response = await axios.get(url, config);
    
    localStorage.setItem(cacheKey, JSON.stringify({
      data: response.data,
      timestamp: Date.now()
    }));
    
    return response.data;
  } catch (error) {

    if (stored) {
      // console.warn('Server down, uso cache vecchia:', cacheKey);
      const { data } = JSON.parse(stored);
      return data;
    }
    throw error;
  }
};

export const clearCache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
  // console.log('Cache pulita');
};
