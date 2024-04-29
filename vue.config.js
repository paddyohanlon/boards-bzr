module.exports = {
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Bazaar Boards";
      return args;
    });
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/_global-variables.scss";
        `,
      },
    },
  },
  pwa: {
    workboxOptions: {
      navigateFallback: "index.html",
    },
  },
};
