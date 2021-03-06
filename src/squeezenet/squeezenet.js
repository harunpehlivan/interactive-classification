"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dl = require("deeplearn");
var model_util = require("./util");
var imagenet_classes_1 = require("./imagenet_classes");
var GOOGLE_CLOUD_STORAGE_DIR = 'https://storage.googleapis.com/learnjs-data/checkpoint_zoo/';
var SqueezeNet = (function () {
    function SqueezeNet() {
        this.preprocessOffset = dl.tensor1d([103.939, 116.779, 123.68]);
    }
    SqueezeNet.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var checkpointLoader, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        checkpointLoader = new dl.CheckpointLoader(GOOGLE_CLOUD_STORAGE_DIR + 'squeezenet1_1/');
                        _a = this;
                        return [4, checkpointLoader.getAllVariables()];
                    case 1:
                        _a.variables = _b.sent();
                        return [2];
                }
            });
        });
    };
    SqueezeNet.prototype.predict = function (input) {
        if (input.shape[0] !== 227 || input.shape[1] !== 227 ||
            input.shape[2] !== 3) {
            throw new Error("The input Tensor shape is [" + input.shape + "]. Should be [227,227,3]");
        }
        return this.predictWithActivation(input).logits;
    };
    SqueezeNet.prototype.predictWithActivation = function (input, activationName) {
        var _this = this;
        return dl.tidy(function () {
            var activation;
            var preprocessedInput = dl.sub(input.asType('float32'), _this.preprocessOffset);
            var conv1relu = preprocessedInput
                .conv2d(_this.variables['conv1_W:0'], 2, 0)
                .add(_this.variables['conv1_b:0'])
                .relu();
            if (activationName === 'conv_1') {
                activation = conv1relu;
            }
            var pool1 = conv1relu.maxPool(3, 2, 0);
            if (activationName === 'maxpool_1') {
                activation = pool1;
            }
            var fire2 = _this.fireModule(pool1, 2);
            if (activationName === 'fire2') {
                activation = fire2;
            }
            var fire3 = _this.fireModule(fire2, 3);
            if (activationName === 'fire3') {
                activation = fire3;
            }
            var pool2 = fire3.maxPool(3, 2, 'valid');
            if (activationName === 'maxpool_2') {
                activation = pool2;
            }
            var fire4 = _this.fireModule(pool2, 4);
            if (activationName === 'fire4') {
                activation = fire4;
            }
            var fire5 = _this.fireModule(fire4, 5);
            if (activationName === 'fire5') {
                activation = fire5;
            }
            var pool3 = fire5.maxPool(3, 2, 0);
            if (activationName === 'maxpool_3') {
                activation = pool3;
            }
            var fire6 = _this.fireModule(pool3, 6);
            if (activationName === 'fire6') {
                activation = fire6;
            }
            var fire7 = _this.fireModule(fire6, 7);
            if (activationName === 'fire7') {
                activation = fire7;
            }
            var fire8 = _this.fireModule(fire7, 8);
            if (activationName === 'fire8') {
                activation = fire8;
            }
            var fire9 = _this.fireModule(fire8, 9);
            if (activationName === 'fire9') {
                activation = fire9;
            }
            var conv10 = fire9.conv2d(_this.variables['conv10_W:0'], 1, 0)
                .add(_this.variables['conv10_b:0']);
            if (activationName === 'conv10') {
                activation = conv10;
            }
            return {
                logits: dl.avgPool(conv10, conv10.shape[0], 1, 0).as1D(),
                activation: activation
            };
        });
    };
    SqueezeNet.prototype.fireModule = function (input, fireId) {
        var y = dl.conv2d(input, this.variables["fire" + fireId + "/squeeze1x1_W:0"], 1, 0)
            .add(this.variables["fire" + fireId + "/squeeze1x1_b:0"])
            .relu();
        var left = dl.conv2d(y, this.variables["fire" + fireId + "/expand1x1_W:0"], 1, 0)
            .add(this.variables["fire" + fireId + "/expand1x1_b:0"])
            .relu();
        var right = dl.conv2d(y, this.variables["fire" + fireId + "/expand3x3_W:0"], 1, 1)
            .add(this.variables["fire" + fireId + "/expand3x3_b:0"])
            .relu();
        return left.concat(right, 2);
    };
    SqueezeNet.prototype.getTopKClasses = function (logits, topK) {
        return __awaiter(this, void 0, void 0, function () {
            var predictions, topk, _a, _b, topkIndices, topkValues, topClassesToProbability, i;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        predictions = dl.tidy(function () {
                            return dl.softmax(logits).asType('float32');
                        });
                        _b = (_a = model_util).topK;
                        return [4, predictions.data()];
                    case 1:
                        topk = _b.apply(_a, [_c.sent(), topK]);
                        predictions.dispose();
                        topkIndices = topk.indices;
                        topkValues = topk.values;
                        topClassesToProbability = {};
                        for (i = 0; i < topkIndices.length; i++) {
                            topClassesToProbability[imagenet_classes_1.IMAGENET_CLASSES[topkIndices[i]]] = topkValues[i];
                        }
                        return [2, topClassesToProbability];
                }
            });
        });
    };
    SqueezeNet.prototype.getTop = function (logits, topK) {
        return __awaiter(this, void 0, void 0, function () {
            var predictions, topk, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        predictions = dl.tidy(function () {
                            return dl.softmax(logits).asType('float32');
                        });
                        _b = (_a = model_util).topK;
                        return [4, predictions.data()];
                    case 1:
                        topk = _b.apply(_a, [_c.sent(), topK]);
                        predictions.dispose();
                        return [2, topk];
                }
            });
        });
    };
    SqueezeNet.prototype.getLastWeights = function () {
        return dl.squeeze(this.variables['conv10_W:0']);
    };
    SqueezeNet.prototype.dispose = function () {
        this.preprocessOffset.dispose();
        for (var varName in this.variables) {
            this.variables[varName].dispose();
        }
    };
    SqueezeNet.prototype.CAM = function (softmaxWeights, lastActivation, classX) {
        var softMaxW = dl.transpose(softmaxWeights).gather(dl.tensor1d([classX]));
        var lastAct = dl.transpose(lastActivation.reshape([169, 512]));
        var cam = dl.matMul(softMaxW, lastAct);
        cam = cam.reshape([13, 13]);
        cam = cam.sub(dl.min(cam));
        cam = cam.div(dl.max(cam));
        cam = dl.squeeze(dl.image.resizeBilinear(cam.expandDims(2), [227, 227]));
        return cam;
    };
    return SqueezeNet;
}());
exports.SqueezeNet = SqueezeNet;
