const util = require(`../../util`);

module.exports = async function(metadata) {
  await util.combine(`readme`, `README.md`, {
    replace: metadata,
    reverse: true,
  });
};
