An uptime monitoring tool to check the workability of sites with error notification

# Get started

1) git clone ...
2) npm install
3) cp `src/config/config-example.ts` to `src/config/config.ts`
4) Edit `config.ts`
5) Development run: `npm run dev`
6) Production run: `npm start`

## Structure description

- `src` directory contains the main project files. There is a following structure:
- `src/config` - directory with project settings, contains `config.ts`, that are used in production
  and `config-example.ts` as example for development
- `data` - directory with data files, such as database, logs, etc.

### `package.json` scripts

1) start - Production start
2) dev - Development start (auto restart on code changed)
