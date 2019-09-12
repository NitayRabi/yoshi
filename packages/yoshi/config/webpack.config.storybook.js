const union = require('lodash/union');
const StylableWebpackPlugin = require('@stylable/webpack-plugin');
const {
  createCommonWebpackConfig,
  getStyleLoaders,
} = require('./webpack.config');

const styleLoaders = getStyleLoaders({
  embedCss: true,
  isDebug: true,
  separateCss: false,
  isHmr: false,
  tpaStyle: false,
});

const stylableStorybookPlugin = new StylableWebpackPlugin({
  filename: '[name].stylable.bundle.css',
  optimize: {
    classNameOptimizations: false,
    shortNamespaces: false,
    removeUnusedComponents: false,
  },
  generate: {
    runtimeStylesheetId: 'namespace',
  },
  legacyRuntime: true,
  unsafeBuildNamespace: true,
});

module.exports = config => {
  const webpackCommonConfig = createCommonWebpackConfig({ isDebug: true });

  config.resolve.extensions = union(
    config.resolve.extensions,
    webpackCommonConfig.resolve.extensions,
  );

  config.module.rules = [
    ...webpackCommonConfig.module.rules,

    // Rules for Style Sheets
    ...styleLoaders,
  ];

  config.plugins = [...(config.plugins || []), stylableStorybookPlugin];

  config.node = { ...webpackCommonConfig.node, ...config.node };

  return config;
};
