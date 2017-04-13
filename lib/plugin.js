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

  apply(compiler) {
    compiler.plugin('this-compilation', compilation => {
      if (this.configWarn) compilation.warnings.push(this.configWarn);
      compilation.plugin('html-webpack-plugin-before-html-processing', (data, cb) => {
        data.html = `<${this.tagName} id=${this.tagId}></${this.tagName}>${data.html}`;
        cb(null, data);
      });
    });
  };
}

module.exports = ReactRootPlugin;
