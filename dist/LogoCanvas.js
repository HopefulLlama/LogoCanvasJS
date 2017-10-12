var LogoCanvas =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LogoCanvas = /** @class */ (function () {
    function LogoCanvas(id) {
        var _this = this;
        this.domElement = document.getElementById(id);
        this.context = this.domElement.getContext('2d');
        this.resize();
        window.addEventListener('resize', function () {
            _this.resize();
        });
    }
    LogoCanvas.prototype.clear = function () {
        this.context.clearRect(0, 0, this.domElement.width, this.domElement.height);
    };
    LogoCanvas.prototype.resize = function () {
        this.domElement.width = this.domElement.clientWidth;
        this.domElement.height = this.domElement.clientHeight;
    };
    LogoCanvas.prototype.reduceJourney = function (journey) {
        return journey.reduce(function (accumulator, currentValue, index, array) {
            if (index !== array.length - 1) {
                accumulator.push({
                    start: currentValue,
                    end: array[index + 1]
                });
            }
            return accumulator;
        }, [])
            .filter(function (drawData) {
            return (drawData.start.penDown === true &&
                drawData.end.penDown === true &&
                (drawData.start.colour === drawData.end.colour));
        });
    };
    LogoCanvas.prototype.drawJourney = function (journey) {
        this.reduceJourney(journey).forEach(this.drawLine);
    };
    LogoCanvas.prototype.drawLine = function (drawData) {
        this.context.beginPath();
        this.context.moveTo(drawData.start.position.x, drawData.start.position.y);
        this.context.lineTo(drawData.end.position.x, drawData.end.position.y);
        this.context.stroke();
    };
    return LogoCanvas;
}());
exports.default = LogoCanvas;


/***/ })
/******/ ])["default"];