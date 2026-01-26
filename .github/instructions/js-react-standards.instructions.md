---
applyTo: '*.js, *.jsx, *.ts, *.tsx'
---

## General guidelines

- Write modern ES6+ code following WordPress JS standards
- Use WordPress data store for state management
- Follow WordPress component patterns
- Implement proper WordPress hooks system
- Structure components using WordPress conventions
- Where it applies, make strings available for translation.
- Use `@wordpress/i18n` package to handle translations.
- Use `@wordpress` packages where possible instead of external libraries.
- Use an appropriate unique text domain in your JS code.

## React Components

- Implement WordPress hooks system
- Follow WordPress component lifecycle patterns
- Use the WordPress block editor data stores for state management of WordPress block editor components
- Follow WordPress accessibility guidelines

## TypeScript

- When using TypeScript in Webpack or Vite, use `@babel/preset-typescript` rather than `ts-loader`.
