import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import type { Stats, InputTemplate, OutputFile } from './types';
declare class PlaywrightReportSummary implements Reporter {
    outputFile: OutputFile;
    private startTime;
    private endTime;
    inputTemplate: InputTemplate;
    stats: Stats;
    constructor(options?: {
        outputFile?: string;
        inputTemplate?: () => string;
    });
    onBegin(config: any, suite: any): void;
    onTestEnd(test: TestCase, result: TestResult): Promise<void>;
    onEnd(): Promise<void>;
}
export default PlaywrightReportSummary;
