export default {
    "**/*.{js,jsx,ts,tsx}": ["eslint --ext .ts,.tsx --fix"],
    "**/*.{ts,tsx}": () => "npm run typecheck",
    "**/*.{js,jsx,ts,tsx,scss,md,yml,yaml}": "prettier --write --ignore-unknown",
};
