class ReactRootPlugin {
  constructor(options) {
    if (Object.prototype.toString.call(options) !== '[object Object]') {
      if (typeof options !== 'undefined') {
        this.configWarn = 'ReactRootPlugin: Invalid configuration. Using default options.';
      }

      options = {
        tagName: 'div',
        id: 'react-root'
      };
    }
    this.tagName = options.tagName || 'div';
    this.id = options.id || 'react-root';
  }

  apply(compiler) {
    compiler.plugin('this-compilation', compilation => {
      if (this.configWarn) compilation.warnings.push(this.configWarn);
      compilation.plugin('html-webpack-plugin-before-html-processing', (data, cb) => {
        data.html = `<${this.tagName} id=${this.id}></${this.tagName}>${data.html}`;
        cb(null, data);
      });
    });
  };
}

module.exports = ReactRootPlugin;

