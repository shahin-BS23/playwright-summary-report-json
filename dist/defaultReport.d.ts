import type { Stats } from './types';
export default class DefaultReport {
    stats: Stats;
    constructor(stats: any);
    templateReport(): string;
}
