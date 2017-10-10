module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: [
      'dist/LogoCanvas.min.js',
      'spec/unit/**/*Spec.js'
    ]
  });
};