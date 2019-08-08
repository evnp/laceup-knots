const util = require(`../../util`);

module.exports = async function(metadata) {
  await util.combine(`test`, `package.json`, {
    replace: {
      ...metadata,
      testCommand: await util.enter(`Enter test command:`, {
        initial: `tap test.js`,
      }),
    },
  });
};
