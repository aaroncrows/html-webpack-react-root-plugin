const assert = require('assert');
const Plugin = require('../lib/plugin');
const constants = require('../lib/constants');

const tagName = constants.DEFAULT_TAG_NAME;
const tagId = constants.DEFAULT_TAG_ID;
const configWarn = constants.CONFIG_WARNING;

describe('Plugin class', () => {
  it('should configure a plugin with passed options object', () => {
    const testPlugin = new Plugin({ tagName: 'testTag', tagId: 'testId' });

    assert.deepEqual(testPlugin, { tagName: 'testTag', tagId: 'testId' });
  });

  it('should configure a plugin with defaults when no arguments are passed', () => {
    const testPlugin = new Plugin();

    assert.deepEqual(testPlugin, { tagName, tagId });
  });

  it('should configure a plugin with the passed in string as testId', () => {
    const testPlugin = new Plugin('testId');

    assert.deepEqual(testPlugin, { tagName, tagId: 'testId' });
  });

  it('should configure a plugin with defaults and a warning on anything else', () => {
    const testPlugin = new Plugin(null);

    assert.deepEqual(testPlugin, { tagName, tagId, configWarn })
  });
});

describe('apply method', () => {
  let testCompiler;

  beforeEach(() => {
    testCompiler = (testCb) => {
      return {
        plugin(_, cb) {
          const testCompilation = {
            warnings: [],
            plugin(_, cb) {
              const testData = { html: '', warnings: this.warnings };
              cb(testData, testCb);
            }
          };
          cb(testCompilation);
        }
      };
    };
  });

  it('should add the appropriate tag to the data', () => {
    const testPlugin = new Plugin();

    testPlugin.apply(testCompiler((err, data) => {
      assert.equal(err, null);
      assert.equal(data.html, '<div id=react-root></div>');
    }));
  });

  it('should push an error to warnings on invalid input', () => {
    const testPlugin = new Plugin(null);

    testPlugin.apply(testCompiler((err, data) => {
      assert.equal(err, null);
      assert.equal(data.warnings[0], configWarn);
    }));
  });
});

