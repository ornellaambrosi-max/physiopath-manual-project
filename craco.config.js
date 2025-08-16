const path = require('path');
module.exports = {
  webpack: {
    alias: { '@': path.resolve(__dirname, 'src') },
    configure: (config) => {
      const set = new Set([...(config.resolve.extensions || []), '.jsx', '.js']);
      config.resolve.extensions = Array.from(set);
      return config;
    },
  },
};
