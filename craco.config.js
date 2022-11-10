const path = require("path");
module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/Components"),
      "@models": path.resolve(__dirname, "src/Models"),
      "@common": path.resolve(__dirname, "src/Common"),
    },
  },
};
