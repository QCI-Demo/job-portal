const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const distDir = path.join(__dirname, '../dist');

const cssFiles = [
  'styles/global.css',
  'components/Button/Button.css',
  'components/NavBar/NavBar.css',
  'components/FormInput/FormInput.css',
  'components/DataTable/DataTable.css',
  'components/Modal/Modal.css',
  'components/ChartContainer/ChartContainer.css',
];

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const combined = cssFiles
  .map((file) => fs.readFileSync(path.join(srcDir, file), 'utf8'))
  .join('\n');

fs.writeFileSync(path.join(distDir, 'dashboard-ui.css'), combined);
console.log('Built dashboard-ui.css');
