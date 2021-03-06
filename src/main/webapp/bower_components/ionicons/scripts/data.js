const fs = require('fs-extra');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const SRC_SVG_DIR = path.join(SRC_DIR, 'svg');
const SRC_JSON = path.join(SRC_DIR, 'data.json');
const DST_DIR = path.join(ROOT_DIR, 'dist');
const DST_JSON = path.join(DST_DIR, 'ionicons/data.json');
const DOCS_JSON = path.join(ROOT_DIR, 'docs/data.json');


console.log('checking icon data: ' + SRC_JSON);

let srcData = fs.readJsonSync(SRC_JSON);
let svgFiles = fs.readdirSync(SRC_SVG_DIR);

svgFiles.filter(f => f.indexOf('.svg') > -1).forEach(svgFile => {
  let iconName = svgFile.split('.')[0];

  let icon = srcData.icons.find(i => i.icons.indexOf(iconName) > -1);
  if (!icon) {
    console.log('icon data missing for: ' + svgFile);
  }
});

srcData.icons.forEach(i => {
  if (i.tags.length === 0) {
    console.log('icon data missing search tags for: ' + i.icons);
  }

  i.icons.forEach(iconName => {
    let svgFile = iconName + '.svg';

    let f = svgFiles.find(f => f === svgFile);
    if (!f) {
      console.log('icon data contains "' + iconName + '", but the file "' + path.join(SRC_SVG_DIR, svgFile) + '" doesn\'t exist');
    }
  });
});


let content = JSON.stringify(srcData);
fs.writeFileSync(DST_JSON, content);
fs.writeFileSync(DOCS_JSON, content);
