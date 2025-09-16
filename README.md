

# TRA Global Styles

A centralized SCSS/CSS style library for managing shared design tokens, utility classes, and global styles across the TRA design system.

## 🚀 Purpose

This package provides global styles used across multiple projects or components, ensuring visual consistency and maintainability.

## 📦 Features

- Global SCSS variables and mixins (colors, spacing, breakpoints, etc.)
- Base element styling and resets
- Utility and helper classes
- Global typography rules

## 🛠 Usage

### 1. Install

Add this to your dependencies in `package.json` and select the version you want:
```json
    "tra-global-styles": "github:elevatedthird/tra-global-styles#1.0.0",
```

### 2. Import in your SCSS entry point:

```scss
@import "~tra-global-styles/src/01-global/scss/global.scss";
```

Make sure your build tool (Webpack, Vite, etc.) includes the path to the SCSS files.

## 🧪 Webpack
Here is a sample `sass-loader` configuration for Webpack this is optional but recommended:

```json
{
  loader: 'sass-loader',
  options: {
    additionalData: '@import "tra-global-styles/src/00-config/_index.scss";',
    sassOptions: {
      quietDeps: true,
      includePaths: [
        path.resolve(__dirname, '../node_modules'),
        path.resolve(__dirname, '../node_modules/foundation-sites/scss'),
        path.resolve(__dirname, '../node_modules/tra-global-styles/src/00-config'),
      ],
    },
    sourceMap: isDev,
  },
}
```

## 🤝 Contributing

1. 01-global is where all printable global styles are located.
2. 00-config is where all configuration files (variables, mixins, functions) are located. No printable styles should be here.
3. Follow the existing structure and naming conventions.
4. 02-components is reserved components styles that are shared across multiple projects.
5. 03-plugable is for styles that may be used in multiple components but are not guaranteed to be used everywhere.

## 📄 License

MIT
