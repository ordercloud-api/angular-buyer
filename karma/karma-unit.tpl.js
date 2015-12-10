module.exports = function ( karma ) {
  karma.set({
    basePath: "../",
    files: [
      <% scripts.forEach( function ( file ) { %>"<%= file %>",
      <% }); %>,
      "src/**/*.js"
    ],
    exclude: [
      "src/assets/**/*.js"
    ],
    frameworks: [ 'jasmine' ],
    plugins: [ 'karma-jasmine', 'karma-firefox-launcher'],
    preprocessors: { },
    reporters: 'dots',
    port: 9018,
    runnerPort: 9100,
    urlRoot: "/",
    autoWatch: true,
    browsers: [
      'Firefox'
    ]
  });
};

