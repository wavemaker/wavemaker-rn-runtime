// // module.exports = {
// //   presets: ['module:metro-react-native-babel-preset'],
// // };

// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset'],
//     plugins: ['@babel/plugin-transform-class-static-block'],
//   };
// };

// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
// };

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      // 'module:metro-react-native-babel-preset',
      '@babel/preset-typescript',
    ],
    plugins: ['@babel/plugin-transform-class-static-block'],
  };
};
