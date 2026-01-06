const fs = require('fs');
const path = require('path');

// Create directory structure
const directories = [
  'src/background',
  'src/content',
  'src/popup',
  'src/common',
  'src/ml',
  'assets',
  'tests',
  'docs'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Create package.json if it doesn't exist
if (!fs.existsSync('package.json')) {
  const packageJson = {
    "name": "phishing-detector",
    "version": "1.0.0",
    "description": "Browser extension for phishing detection",
    "scripts": {
      "build": "webpack --mode production",
      "dev": "webpack --mode development --watch",
      "test": "jest",
      "lint": "eslint src/",
      "pack": "zip -r phishing-detector.zip dist/ assets/ manifest.json"
    },
    "devDependencies": {
      "webpack": "^5.88.2",
      "webpack-cli": "^5.1.4",
      "copy-webpack-plugin": "^11.0.0",
      "clean-webpack-plugin": "^4.0.0",
      "babel-loader": "^9.1.3",
      "@babel/core": "^7.23.0",
      "@babel/preset-env": "^7.22.20",
      "jest": "^29.7.0",
      "eslint": "^8.51.0"
    }
  };
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('Created package.json');
}

// Create README.md
const readme = `# Phishing Detector Browser Extension

## Installation

1. Clone the repository
2. Run \`npm install\`
3. Run \`npm run dev\` for development
4. Run \`npm run build\` for production

## Loading in Chrome

1. Open Chrome and go to \`chrome://extensions/\`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the \`dist\` folder

## Features

- Real-time URL analysis
- Page content scanning
- Machine learning detection
- User-friendly interface
- Customizable settings

## Development

- Main background script: \`src/background/service-worker.js\`
- Content script: \`src/content/content.js\`
- Popup UI: \`src/popup/\`
- Options page: \`src/options/\`
`;

fs.writeFileSync('README.md', readme);
console.log('Created README.md');

console.log('\n✅ Setup complete! Run the following commands:');
console.log('1. npm install');
console.log('2. npm run dev');
console.log('3. Load the "dist" folder in Chrome extensions');