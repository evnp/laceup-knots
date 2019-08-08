const fs = require(`fs`);
const path = require(`path`);

const util = require(`../../util`);

module.exports = async function(metadata) {
  const readmePath = path.resolve(__dirname, `README.md`);
  const rejectedShields = await util.chooseFromFile(`Choose shields:`, readmePath, {
    invert: true,
    formatLine: line => line.replace(/^.*?([a-z ]+).*$/, `$1`),
  });

  await util.combine(`shields`, `README.md`, {
    replace: metadata,
    filterLinesByRegex: rejectedShields.map(
      shield => new RegExp(`^\[!\[${shield}`)
    ),
  });
};
