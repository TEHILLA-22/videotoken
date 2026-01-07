module.exports = {
  extends: ['next/core-web-vitals'],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@components', './src/components'],
          ['@utils', './src/utils'],
          ['@lib', './src/lib'],
          ['@redux', './src/redux'],
          ['@hooks', './src/hooks'],
          ['@helpers', './src/helpers'],
          ['@providers', './src/providers'],
          ['@public', './public'],
          ['@slices', './src/slices'],
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
