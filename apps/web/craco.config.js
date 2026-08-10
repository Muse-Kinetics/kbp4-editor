// SPDX-License-Identifier: MPL-2.0
// Copyright (c) 2026 KMI Music, Inc.
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}),
        buffer: false,
        stream: false,
        path: false,
        os: false,
        crypto: false,
        fs: false,
      };

      // Remove ESLint plugin — it picks up the project's Babel config via the
      // workbox-build Rollup pipeline, surfacing a stale Babel 6 plugin ref.
      // ESLint still runs in the IDE via the extension.
      webpackConfig.plugins = (webpackConfig.plugins || []).filter(
        (plugin) => plugin.constructor.name !== 'ESLintWebpackPlugin'
      );

      return webpackConfig;
    },
  },
};
