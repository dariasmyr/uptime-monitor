A simple uptime monitoring tool to check the workability of sites with error notification

# Get started

1) git clone ...
2) npm install
3) cp src/config/config-example.js and create src/config/config.ts
4) Edit config.ts
5) Development run: `npm run dev`
6) Production run: `npm start`

## Structure description

- `src` directory contains the main project files. There is a following structure:
- `src/config` - directory with project settings, contains `config.js`, that are used in production
  and `config-example.js` as example for development

### `package.json` scripts

1) start - Production start
2) dev - Development start (auto restart on code changed)
