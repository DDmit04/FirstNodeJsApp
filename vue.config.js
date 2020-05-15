module.exports = {
  "pluginOptions": {
    "express": {
      "shouldServeApp": false,
      "serverDir": "./dist/server"
    }
  },
  devServer: {
    proxy: {
      "/": {
        target: "http://localhost:3000"
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}