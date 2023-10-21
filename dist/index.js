"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const utils_1 = __importDefault(require("./utils"));
const defaultReport_1 = __importDefault(require("./defaultReport"));
const initialStats = () => ({
    testsInSuite: 0,
    totalTestsRun: 0,
    expectedResults: 0,
    unexpectedResults: 0,
    flakyTests: 0,
    testMarkedSkipped: 0,
    failureFree: true,
    durationCPU: 0,
    durationSuite: 0,
    avgTestDuration: 0,
    formattedDurationSuite: '',
    formattedAvgTestDuration: '',
    failures: {},
    workers: 1,
});
class PlaywrightReportSummary {
    outputFile;
    startTime;
    endTime;
    inputTemplate;
    stats;
    constructor(options = {}) {
        this.outputFile = options.outputFile;
        this.inputTemplate = options.inputTemplate;
    }
    onBegin(config, suite) {
        this.startTime = Date.now();
        this.stats = initialStats();
        this.stats.testsInSuite = suite.allTests().length;
        this.stats.workers = config.workers;
    }
    async onTestEnd(test, result) {
        const outcome = test.outcome();
        const { retry } = result;
        if (outcome === 'expected')
            this.stats.expectedResults += 1;
        if (outcome === 'skipped')
            this.stats.testMarkedSkipped += 1;
        if (outcome === 'flaky')
            this.stats.flakyTests += 1;
        if (outcome === 'unexpected') {
            this.stats.failures[test.title] = result.status;
            if (retry === 0) {
                this.stats.unexpectedResults += 1;
            }
        }
        this.stats.totalTestsRun += 1;
        this.stats.durationCPU += result.duration;
        this.stats.failureFree = (this.stats.unexpectedResults - this.stats.flakyTests) === 0;
    }
    async onEnd() {
        this.endTime = Date.now();
        this.stats.durationSuite = this.endTime - this.startTime;
        this.stats.avgTestDuration = Math.ceil(this.stats.durationCPU / (this.stats.totalTestsRun || 1));
        this.stats.formattedAvgTestDuration = (0, utils_1.default)(this.stats.avgTestDuration);
        this.stats.formattedDurationSuite = (0, utils_1.default)(this.stats.durationSuite);
        outputReport(this.stats, this.inputTemplate, this.outputFile);
    }
}
function outputReport(stats, inputTemplate, outputFile = 'results.json') {
    let reportString;
    const report = new defaultReport_1.default(stats);
    if (typeof inputTemplate === 'undefined') {
        reportString = report.templateReport();
    }
    else {
        reportString = inputTemplate(stats);
        if (typeof reportString !== 'string') {
            throw new Error('custom input templates must return a string');
        }
    }
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, reportString);
}
exports.default = PlaywrightReportSummary;
