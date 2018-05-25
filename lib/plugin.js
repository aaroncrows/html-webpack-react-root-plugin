const constants = require('./constants');

const defaultTagName = constants.DEFAULT_TAG_NAME;
const defaultTagId = constants.DEFAULT_TAG_ID;
const configWarn = constants.CONFIG_WARNING;

class ReactRootPlugin {
  constructor(options) {
    if (Object.prototype.toString.call(options) !== '[object Object]') {
      let tagId;
      if (typeof options === 'string') {
        tagId = options;
      } else if (typeof options !== 'undefined') {
        this.configWarn = configWarn;
      }

      options = {
        tagName: defaultTagName,
        tagId: tagId || defaultTagId
      };
    }

    this.tagName = options.tagName || defaultTagName;
    this.tagId = options.tagId || defaultTagId;
  }

  insertRoot(data, cb) {
    const htmlString = data.html;
    const bodyIndex = htmlString.indexOf('</body>');
    const firstHalf = htmlString.slice(0, bodyIndex);
    const secondHalf = htmlString.slice(bodyIndex, htmlString.length);

    data.html = `${firstHalf}  <${this.tagName} id="${this.tagId}"></${this.tagName}>\n  ${secondHalf}`;
    cb(null, data);
  }

  apply(compiler) {
    if (compiler.hooks) {
      // webpack 4
      compiler.hooks.compilation.tap('this-compilation', (compilation) => {
        if (this.configWarn) compilation.warnings.push(this.configWarn);
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('this-compilation',
          (data, cb) => this.insertRoot(data, cb));
      })
    } else {
      // before webpack 4
      compiler.plugin('this-compilation', (compilation) => {
        if (this.configWarn) compilation.warnings.push(this.configWarn);
        compilation.plugin('html-webpack-plugin-before-html-processing',
          (data, cb) => this.insertRoot(data, cb));
      });
    }
  }
}

module.exports = ReactRootPlugin;
