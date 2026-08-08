import {readFileSync} from 'fs';
import {writeFile} from 'fs/promises';
import {
    CreateOverridePayload,
    IOverridesManager,
    Override,
    OverrideFilter,
} from './types.js';
import {logger} from '../logger.js';

class OverrideManager implements IOverridesManager {
    private _overrides: Override[];
    private readonly _filePath = 'overrides.json';
    private readonly _fallbackOverride: Override = {
        id: 0,
        type: 'Default',
        value: {
            regular: 'My cock size is {size}cm {emoji}',
            inside: 'Cock size inside me is {size}cm {emoji}',
        },
    };

    constructor() {
        try {
            this._overrides = this.loadOverrides();
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    getOverrides(): Override[] {
        return this._overrides;
    }
    getOverride(filter: OverrideFilter): Override {
        return (
            this.getUserDateOverride(filter) ??
            this.getDateOverride(filter) ??
            this.getUserOverride(filter) ??
            this.getDefaultOverride()
        );
    }
    createOverride(override: CreateOverridePayload): void {
        this._overrides.push({
            ...override,
            id: this._overrides[this._overrides.length - 1].id + 1,
        });
        this.saveOverrides(this._overrides);
    }
    deleteOverride(id: number): void {
        this._overrides = this._overrides.filter(i => i.id !== id);
        this.saveOverrides(this._overrides);
    }

    private loadOverrides(): Override[] {
        const rawData = readFileSync(this._filePath, 'utf-8');
        return (JSON.parse(rawData) as Override[])?.map((i, index) => ({
            ...i,
            id: index,
        }));
    }

    private saveOverrides(overrides: Override[]): void {
        const jsonString = JSON.stringify(
            overrides,
            (key, value) => (key === 'id' ? undefined : value),
            2
        );
        writeFile(this._filePath, jsonString, 'utf-8')
            .then(() => logger.info('Overrides were successfully saved'))
            .catch(error => logger.error('Overrides were not saved', error));
    }

    private getRandomMatch(overrides: Override[]): Override | undefined {
        const matchCount = overrides.length;
        return matchCount > 0
            ? overrides[Math.floor(Math.random() * matchCount)]
            : undefined;
    }
    private getUserDateOverride(filter: OverrideFilter): Override | undefined {
        if (
            !filter.date ||
            filter.date?.day === undefined ||
            filter.date?.month === undefined ||
            !filter.userId
        ) {
            return undefined;
        }

        const matchingOverrides = this._overrides.filter(
            i =>
                i.type === 'User_Date' &&
                i.userId === filter.userId &&
                i.date.month === filter.date?.month &&
                i.date.day === filter.date?.day
        );

        return this.getRandomMatch(matchingOverrides);
    }
    private getDateOverride(filter: OverrideFilter): Override | undefined {
        if (
            !filter.date ||
            filter.date?.day === undefined ||
            filter.date?.month === undefined
        ) {
            return undefined;
        }

        const matchingOverrides = this._overrides.filter(
            i =>
                i.type === 'Date' &&
                i.date.month === filter.date?.month &&
                i.date.day === filter.date?.day
        );

        return this.getRandomMatch(matchingOverrides);
    }

    private getUserOverride(filter: OverrideFilter): Override | undefined {
        if (!filter.userId) {
            return undefined;
        }

        const matchingOverrides = this._overrides.filter(
            i => i.type === 'User' && i.userId === filter.userId
        );

        return this.getRandomMatch(matchingOverrides);
    }

    private getDefaultOverride(): Override {
        const matchingOverrides = this._overrides.filter(
            i => i.type === 'Default'
        );

        return this.getRandomMatch(matchingOverrides) ?? this._fallbackOverride;
    }
}

export const overrideManager = new OverrideManager();
