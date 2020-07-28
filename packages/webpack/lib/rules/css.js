'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 解析并抽离 wxss 文件
module.exports = function cssRule(options = {}) {
  let cssPattern;
  let cssRules = [];
  let cssExtensions = ['.css', '.wxss'];
  if (options.cssParser === 'sass') {
    cssPattern = /\.(css|scss|sass|wxss)$/;
    cssRules = [
      { loader: 'resolve-url-loader' },
      { loader: './loaders/fix-import-wxss-loader.js' },
      {
        loader: 'sass-loader',
        options: {
          // resolve-url-loader 需要开启 sourceMap 才能工作
          sourceMap: true,
          // NOTE: sass-loader 7.3.0 版本开始
          // 生产环境会默认修改为 compressed
          // 这会导致地址转换失败，这里强制为 nested
          // 压缩的任务，交给 postcss
          sassOptions: {
            outputStyle: 'nested'
          }
        }
      },
      {
        loader: './loaders/import-wxss-loader.js',
        options: { simplifyPath: options.simplifyPath }
      }
    ];
    cssExtensions = cssExtensions.concat(['.scss', '.sass']);
  } else if (options.cssParser === 'less') {
    cssPattern = /\.(css|less|wxss)$/;
    cssRules = [
      { loader: './loaders/fix-import-wxss-loader.js' },
      { loader: 'less-loader', options: { sourceMap: true } },
      {
        loader: './loaders/import-wxss-loader.js',
        options: { simplifyPath: options.simplifyPath }
      }
    ];
    cssExtensions = cssExtensions.concat(['.less']);
  }

  cssRules = [
    {
      loader: 'css-loader',
      options: {
        // 不处理 css 的 @import
        // 充分利用小程序 wxss 本身的 @import
        // 降低 css 的重复合并，降低样式文件大小
        import: false
      }
    },
    // PostCSS 配置
    {
      loader: 'postcss-loader',
      options: {
        plugins: function() {
          let p = [
            require('autoprefixer')({ remove: false, overrideBrowserslist: ['iOS 7']})
          ];

          if (!options.IS_DEV) {
            p = p.concat(
              require('cssnano')({
                preset: [
                  'default',
                  {
                    discardComments: { removeAll: true },
                    // calc 无法计算 rpx，此处禁止
                    calc: false
                  }
                ]
              })
            );
          }

          return p;
        },
        sourceMap: 'inline'
      }
    }
  ].concat(cssRules);

  // 开启 cache
  if (options.cache) cssRules = ['cache-loader'].concat(cssRules);

  const cssRule = {
    test: cssPattern,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: cssRules
    })
  };

  return { cssRule, cssExtensions };
};