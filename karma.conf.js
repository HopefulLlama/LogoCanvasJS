module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: [
      'dist/LogoCanvas.js',
      'spec/unit/**/*Spec.js'
    ]
  });
};