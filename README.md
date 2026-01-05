phishing-detector-extension/
│
├── manifest.json          # Extension manifest
├── package.json          # Dependencies
├── webpack.config.js     # Build configuration
│
├── src/
│   ├── background/       # Service worker/background scripts
│   │   ├── main.js
│   │   ├── url-analyzer.js
│   │   └── threat-database.js
│   │
│   ├── content/          # Content scripts
│   │   ├── content.js
│   │   ├── dom-analyzer.js
│   │   └── form-detector.js
│   │
│   ├── popup/           # Popup interface
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   │
│   ├── options/         # Options page
│   │   ├── options.html
│   │   ├── options.js
│   │   └── options.css
│   │
│   ├── common/          # Shared utilities
│   │   ├── constants.js
│   │   ├── utils.js
│   │   └── storage.js
│   │
│   └── ml/              # Machine learning components
│       ├── tf-model/    # TensorFlow.js models
│       ├── features.js  # Feature extraction
│       └── predictor.js # Prediction logic
│
├── assets/              # Icons, images, etc.
├── locales/             # Internationalization
├── tests/               # Test files
└── docs/                # Documentation