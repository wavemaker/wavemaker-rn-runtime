module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'module:metro-react-native-babel-preset', //default present of react-native projects
      'babel-preset-expo', // for expo projects
      '@babel/preset-typescript', // for typescript support
    ],
    plugins: ['@babel/plugin-transform-class-static-block'],
  };
};
