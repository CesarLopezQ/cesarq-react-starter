# create-cesarq-starter

A minimal React + TypeScript + Vite starter initializer.

It creates a clean React project with TypeScript, Vite, ESLint, Prettier, VS Code configuration, a CSS reset, and GitHub Pages deployment support.

## Create a project

```bash
npm create cesarq-starter my-project
```

Then:

```bash
cd my-project
npm run dev
```

Open the local URL provided by Vite.

## Included

The generated project includes:

- React
- TypeScript
- Vite
- ESLint
- Prettier
- VS Code settings and recommended extensions
- CSS reset and base styles
- TypeScript configuration
- GitHub Pages deployment workflow
- Production build configuration

The generated project is intentionally minimal and does not include the default Vite demo application.

## Scripts

### Development

```bash
npm run dev
```

Starts the development server.

### Build

```bash
npm run build
```

Runs TypeScript checking and creates a production build.

### Lint

```bash
npm run lint
```

Runs ESLint.

### Format

```bash
npm run format
```

Formats the project with Prettier.

### Format check

```bash
npm run format:check
```

Checks whether files are formatted correctly.

### Full validation

```bash
npm run check
```

Runs ESLint, Prettier validation, TypeScript checking, and the production build.

### Preview

```bash
npm run preview
```

Previews the production build locally.

## GitHub Pages

Generated projects include a GitHub Actions workflow for deploying to GitHub Pages.

After creating the project:

1. Create a GitHub repository for the project.
2. Push the generated project to the `main` branch.
3. Open the repository's **Settings**.
4. Open **Pages**.
5. Set the deployment source to **GitHub Actions**.
6. Push changes to `main`.

The included workflow builds the project and deploys the `dist` directory to GitHub Pages.

The starter repository itself does not use this workflow because the deployment workflow is contained inside the generated project template.

## Project structure

A generated project has the following basic structure:

```text
my-project/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── .prettierignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── prettier.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Development philosophy

This starter provides the configuration needed to begin a React project without the example application and unnecessary boilerplate normally included in a scaffolded project.

The generated application starts with a simple `Hello World` component that can be replaced immediately.

## Requirements

Node.js 24 or newer is required.

## License

MIT
