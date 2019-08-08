const fs = require(`fs`);
const path = require(`path`);
const request = require(`request-promise-native`);

const util = require(`../../util`);

module.exports = async function(metadata) {
  const requestOptions = {
    json: true,
    headers: {
      'user-agent': metadata.user,
    },
  };

  const licenses = await request({
    ...requestOptions,
    url: `https://api.github.com/licenses`,
  });

  const [license] = await util.choose(`Choose license:`, licenses, {
    formatChoice: license => license.name,
    multiselect: false,
  });

  const licenseData = await request({
    ...requestOptions,
    url: license.url,
  });

  const licensePath = path.resolve(process.cwd(), `LICENSE`);
  let licenseText = licenseData.body

  for (keyword of licenseText.match(/\[.+?\]/g) || []) {
    const year = new Date().getFullYear().toString();
    const initial =
      keyword.match(/year/i) ? year :
      keyword.match(/yyyy/i) ? year :
      keyword.match(/name/i) ? metadata.user :
      null;

    const formattedKeyword = keyword.replace(`[`, ``).replace(`]`, ``);
    const replacement = await util.enter(`Enter license ${formattedKeyword}:`, {
      initial,
      validationRegex: /.+/,
    });

    if (replacement) {
      licenseText = licenseText.replace(keyword, replacement);
    }
  }

  fs.writeFileSync(licensePath, licenseText);
};
