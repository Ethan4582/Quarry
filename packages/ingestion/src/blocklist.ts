const BLOCKED_PATTERNS = [
  /^(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lock|shrinkwrap\.yaml)$/,
  /^node_modules\//, /^\.yarn\//, /^\.pnp/,
  /^(dist|build|\.next|\.nuxt|\.output|out|target|bin|obj)\//, /\.tsbuildinfo$/,
  /^(\.cache|\.parcel-cache|\.svelte-kit|\.turbo)\//, /\.(eslintcache|stylelintcache)$/,
  /\.log$/, /^logs\//,
  /^\.env(\..*)?$/,
  /^\.vscode\//, /^\.idea\//, /\.(swp|swo)$/, /^(\.DS_Store|Thumbs\.db|Desktop\.ini)$/,
  /^coverage\//, /^\.nyc_output\//, /\.lcov$/,
  /^(\.tmp|\.temp|temp|tmp)\//,
  /^\.(git|svn|hg)\//,
  /^(README|readme|CHANGELOG|CHANGES|LICENSE)\.(md|txt)$/,
  /^\.(eslintrc|prettierrc|babelrc|stylelintrc|yarnrc|npmrc)/,
  /^(jest|webpack|vite)\.config\./,
  /^(tsconfig|jsconfig)\.json$/,
  /^\.(dockerignore|gitattributes|gitignore|editorconfig)$/,
  /\.(png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|map)$/,
  /^__tests__\//, /\.(test|spec)\.(ts|js|tsx|jsx)$/,
  /\.min\.(js|css)$/,
];

export function isBlocked(path: string): boolean {
  return BLOCKED_PATTERNS.some((p) => p.test(path));
}
