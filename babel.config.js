module.exports = {
  ignore: [/\/node_modules\/(?!.*.*\/.*.mjs)/],
  presets: [
    [
      '@babel/preset-env',
      {
        'targets': '> 0.25%, ie 9',
      },
    ],
  ],
};
