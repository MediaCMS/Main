import LRUCache from 'lru-cache';
import config from './config.js';

export default new LRUCache({ max: config.cache });