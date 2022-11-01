module.exports = {
  entry: [
    clientPath
  ]
  resolve: {
    extensions: [".js", ".jsx"],
  },
  output: {
    path: serverPublicPath,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["@babel/plugin-transform-react-jsx"],
          },
        },
      },
    ],
  },
  performance: {
    hints: false,
  },
};
