"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
exports.__esModule = true;
exports.getTutorialShaders = exports.getTutorialReadme = exports.getTutorial = exports.getTutorials = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
// 获取教程数据的服务端函数
function getTutorials(locale) {
    return __awaiter(this, void 0, Promise, function () {
        var tutorials, tutorialsDir, categories, _i, categories_1, category, categoryDir, tutorialDirs, _a, tutorialDirs_1, tutorialDir, configPath, configContent, config, title, description;
        return __generator(this, function (_b) {
            tutorials = [];
            tutorialsDir = path_1["default"].join(process.cwd(), 'src/lib/tutorials');
            try {
                categories = fs_1["default"].readdirSync(tutorialsDir, { withFileTypes: true })
                    .filter(function (dirent) { return dirent.isDirectory(); })
                    .map(function (dirent) { return dirent.name; });
                for (_i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
                    category = categories_1[_i];
                    categoryDir = path_1["default"].join(tutorialsDir, category);
                    tutorialDirs = fs_1["default"].readdirSync(categoryDir, { withFileTypes: true })
                        .filter(function (dirent) { return dirent.isDirectory(); })
                        .map(function (dirent) { return dirent.name; });
                    for (_a = 0, tutorialDirs_1 = tutorialDirs; _a < tutorialDirs_1.length; _a++) {
                        tutorialDir = tutorialDirs_1[_a];
                        configPath = path_1["default"].join(categoryDir, tutorialDir, 'config.json');
                        if (fs_1["default"].existsSync(configPath)) {
                            try {
                                configContent = fs_1["default"].readFileSync(configPath, 'utf-8');
                                config = JSON.parse(configContent);
                                title = void 0;
                                description = void 0;
                                if (typeof config.title === 'object') {
                                    title = config.title[locale] || config.title.zh;
                                }
                                else {
                                    title = locale === 'en' && config.title_en ? config.title_en : config.title;
                                }
                                if (typeof config.description === 'object') {
                                    description = config.description[locale] || config.description.zh;
                                }
                                else {
                                    description = locale === 'en' && config.description_en ? config.description_en : config.description;
                                }
                                tutorials.push({
                                    id: config.id,
                                    title: title,
                                    description: description,
                                    difficulty: config.difficulty,
                                    category: config.category
                                });
                            }
                            catch (error) {
                                console.error("Error parsing config for " + tutorialDir + ":", error);
                            }
                        }
                    }
                }
                return [2 /*return*/, tutorials];
            }
            catch (error) {
                console.error('Error reading tutorials:', error);
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    });
}
exports.getTutorials = getTutorials;
// 获取单个教程数据
function getTutorial(category, id, locale) {
    return __awaiter(this, void 0, Promise, function () {
        var configPath, configContent, config, title, description;
        return __generator(this, function (_a) {
            configPath = path_1["default"].join(process.cwd(), 'src/lib/tutorials', category, id, 'config.json');
            try {
                if (!fs_1["default"].existsSync(configPath)) {
                    return [2 /*return*/, null];
                }
                configContent = fs_1["default"].readFileSync(configPath, 'utf-8');
                config = JSON.parse(configContent);
                title = void 0;
                description = void 0;
                if (typeof config.title === 'object') {
                    title = config.title[locale] || config.title.zh;
                }
                else {
                    title = locale === 'en' && config.title_en ? config.title_en : config.title;
                }
                if (typeof config.description === 'object') {
                    description = config.description[locale] || config.description.zh;
                }
                else {
                    description = locale === 'en' && config.description_en ? config.description_en : config.description;
                }
                return [2 /*return*/, {
                        id: config.id,
                        title: title,
                        description: description,
                        difficulty: config.difficulty,
                        category: config.category
                    }];
            }
            catch (error) {
                console.error("Error reading tutorial " + category + "/" + id + ":", error);
                return [2 /*return*/, null];
            }
            return [2 /*return*/];
        });
    });
}
exports.getTutorial = getTutorial;
// 获取教程的README内容
function getTutorialReadme(category, id, locale) {
    return __awaiter(this, void 0, Promise, function () {
        var tutorialDir, readmePath, enReadmePath;
        return __generator(this, function (_a) {
            tutorialDir = path_1["default"].join(process.cwd(), 'src/lib/tutorials', category, id);
            try {
                readmePath = void 0;
                console.log('%c [  ]-142', 'font-size:13px; background:pink; color:#bf2c9f;', locale);
                if (locale === 'en') {
                    enReadmePath = path_1["default"].join(tutorialDir, 'en-README.md');
                    if (fs_1["default"].existsSync(enReadmePath)) {
                        readmePath = enReadmePath;
                    }
                    else {
                        // 如果没有英文版本，回退到中文版本
                        readmePath = path_1["default"].join(tutorialDir, 'README.md');
                    }
                }
                else {
                    // 中文或其他语言，使用默认README
                    readmePath = path_1["default"].join(tutorialDir, 'README.md');
                }
                console.log(readmePath);
                if (fs_1["default"].existsSync(readmePath)) {
                    return [2 /*return*/, fs_1["default"].readFileSync(readmePath, 'utf-8')];
                }
                return [2 /*return*/, ''];
            }
            catch (error) {
                console.error("Error reading README for " + category + "/" + id + ":", error);
                return [2 /*return*/, ''];
            }
            return [2 /*return*/];
        });
    });
}
exports.getTutorialReadme = getTutorialReadme;
// 获取教程的着色器代码
function getTutorialShaders(category, id) {
    return __awaiter(this, void 0, Promise, function () {
        var tutorialDir, result, fragmentPath, vertexPath, exercisePath;
        return __generator(this, function (_a) {
            tutorialDir = path_1["default"].join(process.cwd(), 'src/lib/tutorials', category, id);
            result = {
                fragment: '',
                vertex: '',
                exercise: ''
            };
            try {
                fragmentPath = path_1["default"].join(tutorialDir, 'fragment.glsl');
                if (fs_1["default"].existsSync(fragmentPath)) {
                    result.fragment = fs_1["default"].readFileSync(fragmentPath, 'utf-8');
                }
                vertexPath = path_1["default"].join(tutorialDir, 'vertex.glsl');
                if (fs_1["default"].existsSync(vertexPath)) {
                    result.vertex = fs_1["default"].readFileSync(vertexPath, 'utf-8');
                }
                exercisePath = path_1["default"].join(tutorialDir, 'fragment-exercise.glsl');
                if (fs_1["default"].existsSync(exercisePath)) {
                    result.exercise = fs_1["default"].readFileSync(exercisePath, 'utf-8');
                }
                return [2 /*return*/, result];
            }
            catch (error) {
                console.error("Error reading shaders for " + category + "/" + id + ":", error);
                return [2 /*return*/, result];
            }
            return [2 /*return*/];
        });
    });
}
exports.getTutorialShaders = getTutorialShaders;
