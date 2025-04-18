import * as path from 'path';
import { Statistics } from '../models/Statistics';
import { TextTableFormatter } from './TextTableFormatter';
import { MarkdownTableFormatter } from './MarkdownTableFormatter';
import { getOrSet } from '../utils/MapUtils';

interface Result {
    filePath: string;
    language: string;
    count: any;
    tokenCount: any;
}

export class ResultFormatter {
    private dirResultTable = new Map<string, Statistics>();
    private langResultTable = new Map<string, Statistics>();
    private total = new Statistics('Total');
    private valueToString: (obj: any) => string;

    constructor(
        private targetDir: string,
        private results: Result[],
        private options: {
            printCommas: boolean;
            countDirectLevelFiles: boolean;
        }
    ) {
        this.valueToString = options.printCommas ? this.toStringWithCommas : (obj: any) => obj.toString();

        const directLevelResultTable = new Map<string, Statistics>();
        results.forEach((result) => {
            let parent = path.dirname(path.relative(this.targetDir, result.filePath));
            getOrSet(directLevelResultTable, parent, () => new Statistics(parent + " (Files)")).add(Object.assign(result.count, { tokenCount: result.tokenCount }));
            while (parent.length >= 0) {
                getOrSet(this.dirResultTable, parent, () => new Statistics(parent)).add(Object.assign(result.count, { tokenCount: result.tokenCount }));
                const p = path.dirname(parent);
                if (p === parent) {
                    break;
                }
                parent = p;
            }
            getOrSet(this.langResultTable, result.language, () => new Statistics(result.language)).add(Object.assign(result.count, { tokenCount: result.tokenCount }));
            this.total.add(Object.assign(result.count, { tokenCount: result.tokenCount }));
        });

        if (options.countDirectLevelFiles) {
            [...directLevelResultTable.entries()].filter(([key, value]) => {
                return value.total !== (this.dirResultTable.get(key)?.total ?? 0);
            }).forEach(([, value]) => this.dirResultTable.set(value.name, value));
        }
    }

    private toStringWithCommas(obj: any) {
        if (typeof obj === 'number') {
            return new Intl.NumberFormat('en-US').format(obj);
        } else {
            return obj.toString();
        }
    }

    toText() {
        const maxNamelen = Math.max(...this.results.map(res => res.filePath.length));
        const maxLanglen = Math.max(...[...this.langResultTable.keys()].map(l => l.length));
        const resultFormat = new TextTableFormatter(this.valueToString, 
            { title: 'filename', width: maxNamelen }, 
            { title: 'language', width: maxLanglen },
            { title: 'code', width: 10 }, 
            { title: 'comment', width: 10 }, 
            { title: 'blank', width: 10 }, 
            { title: 'total', width: 10 },
            { title: 'tokens', width: 10 }
        );
        const dirFormat = new TextTableFormatter(this.valueToString, 
            { title: 'path', width: maxNamelen }, 
            { title: 'files', width: 10 },
            { title: 'code', width: 10 }, 
            { title: 'comment', width: 10 }, 
            { title: 'blank', width: 10 }, 
            { title: 'total', width: 10 },
            { title: 'tokens', width: 10 }
        );
        const langFormat = new TextTableFormatter(this.valueToString, 
            { title: 'language', width: maxLanglen }, 
            { title: 'files', width: 10 },
            { title: 'code', width: 10 }, 
            { title: 'comment', width: 10 }, 
            { title: 'blank', width: 10 }, 
            { title: 'total', width: 10 },
            { title: 'tokens', width: 10 }
        );

        return [
            `Directory : ${this.targetDir}`,
            `Total : ${this.total.files} files,  ${this.total.code} codes, ${this.total.comment} comments, ${this.total.blank} blanks, all ${this.total.total} lines, ${this.total.tokenCount.tokens} tokens`,
            '',
            'Languages',
            ...langFormat.headerLines,
            ...[...this.langResultTable.values()].sort((a, b) => b.code - a.code)
                .map(v => langFormat.line(v.name, v.files, v.code, v.comment, v.blank, v.total, v.tokenCount.tokens)),
            ...langFormat.footerLines,
            '',
            'Directories',
            ...dirFormat.headerLines,
            ...[...this.dirResultTable.values()].sort((a, b) => a.name.localeCompare(b.name))
                .map(v => dirFormat.line(v.name, v.files, v.code, v.comment, v.blank, v.total, v.tokenCount.tokens)),
            ...dirFormat.footerLines,
            '',
            'Files',
            ...resultFormat.headerLines,
            ...this.results.sort((a, b) => a.filePath.localeCompare(b.filePath))
                .map(v => resultFormat.line(v.filePath, v.language, v.count.code, v.count.comment, v.count.blank, v.count.total, v.tokenCount.tokens)),
            resultFormat.line('Total', '', this.total.code, this.total.comment, this.total.blank, this.total.total, this.total.tokenCount.tokens),
            ...resultFormat.footerLines,
        ].join('\n');
    }

    toTextLimited() {
        const maxNamelen = Math.max(...this.results.map(res => res.filePath.length));
        const maxLanglen = Math.max(...[...this.langResultTable.keys()].map(l => l.length));
        
        // Set reasonable maximum widths for columns
        const MAX_PATH_WIDTH = 60;
        const MAX_LANG_WIDTH = 15;
        
        const resultFormat = new TextTableFormatter(this.valueToString, 
            { title: 'filename', width: Math.min(maxNamelen, MAX_PATH_WIDTH) }, 
            { title: 'language', width: Math.min(maxLanglen, MAX_LANG_WIDTH) },
            { title: 'code', width: 10 }, 
            { title: 'comment', width: 10 }, 
            { title: 'blank', width: 10 }, 
            { title: 'total', width: 10 },
            { title: 'tokens', width: 10 }
        );
        const dirFormat = new TextTableFormatter(this.valueToString, 
            { title: 'path', width: Math.min(maxNamelen, MAX_PATH_WIDTH) }, 
            { title: 'files', width: 10 },
            { title: 'code', width: 10 }, 
            { title: 'comment', width: 10 }, 
            { title: 'blank', width: 10 }, 
            { title: 'total', width: 10 },
            { title: 'tokens', width: 10 }
        );
        const langFormat = new TextTableFormatter(this.valueToString, 
            { title: 'language', width: Math.min(maxLanglen, MAX_LANG_WIDTH) }, 
            { title: 'files', width: 10 },
            { title: 'code', width: 10 }, 
            { title: 'comment', width: 10 }, 
            { title: 'blank', width: 10 }, 
            { title: 'total', width: 10 },
            { title: 'tokens', width: 10 }
        );

        // Function to truncate long paths
        const truncatePath = (p: string, maxLength: number) => {
            if (p.length <= maxLength) return p;
            const start = p.substring(0, Math.floor(maxLength / 2) - 3);
            const end = p.substring(p.length - Math.floor(maxLength / 2));
            return `${start}...${end}`;
        };

        // Get top 10 directories by code count
        const topDirectories = [...this.dirResultTable.values()]
            .sort((a, b) => b.code - a.code)
            .slice(0, 10);
        
        // Get top 10 files by code count
        const topFiles = this.results
            .sort((a, b) => b.count.code - a.count.code)
            .slice(0, 10);

        return [
            `Directory : ${this.targetDir}`,
            `Total : ${this.total.files} files,  ${this.total.code} codes, ${this.total.comment} comments, ${this.total.blank} blanks, all ${this.total.total} lines, ${this.total.tokenCount.tokens} tokens`,
            '',
            'Languages',
            ...langFormat.headerLines,
            ...[...this.langResultTable.values()].sort((a, b) => b.code - a.code)
                .map(v => langFormat.line(v.name, v.files, v.code, v.comment, v.blank, v.total, v.tokenCount.tokens)),
            ...langFormat.footerLines,
            '',
            'Top 10 Directories (by code count)',
            ...dirFormat.headerLines,
            ...topDirectories
                .map(v => dirFormat.line(truncatePath(v.name, MAX_PATH_WIDTH), v.files, v.code, v.comment, v.blank, v.total, v.tokenCount.tokens)),
            ...dirFormat.footerLines,
            '',
            'Top 10 Files (by code count)',
            ...resultFormat.headerLines,
            ...topFiles
                .map(v => resultFormat.line(
                    truncatePath(path.relative(this.targetDir, v.filePath), MAX_PATH_WIDTH),
                    v.language, 
                    v.count.code, 
                    v.count.comment, 
                    v.count.blank, 
                    v.count.total, 
                    v.tokenCount.tokens
                )),
            resultFormat.line('Total', '', this.total.code, this.total.comment, this.total.blank, this.total.total, this.total.tokenCount.tokens),
            ...resultFormat.footerLines,
        ].join('\n');
    }

    toJson() {
        return JSON.stringify({
            directory: this.targetDir,
            total: {
                files: this.total.files,
                code: this.total.code,
                comment: this.total.comment,
                blank: this.total.blank,
                total: this.total.total,
                tokens: this.total.tokenCount.tokens
            },
            languages: Object.fromEntries([...this.langResultTable.entries()].map(([k, v]) => [k, {
                files: v.files,
                code: v.code,
                comment: v.comment,
                blank: v.blank,
                total: v.total,
                tokens: v.tokenCount.tokens
            }])),
            directories: Object.fromEntries([...this.dirResultTable.entries()].map(([k, v]) => [k, {
                files: v.files,
                code: v.code,
                comment: v.comment,
                blank: v.blank,
                total: v.total,
                tokens: v.tokenCount.tokens
            }])),
            files: this.results.map(v => ({
                path: v.filePath,
                language: v.language,
                code: v.count.code,
                comment: v.count.comment,
                blank: v.count.blank,
                total: v.count.total,
                tokens: v.tokenCount.tokens
            }))
        }, null, 2);
    }

    toCsv() {
        const languages = [...this.langResultTable.keys()];
        return [
            `"filename","language","${languages.join('","')}","comment","blank","total"`,
            ...this.results.sort((a, b) => a.filePath.localeCompare(b.filePath))
                .map(v => `"${v.filePath}","${v.language}",${languages.map(l => l === v.language ? v.count.code : 0).join(',')},${v.count.comment},${v.count.blank},${v.count.total}`),
            `"Total","-",${[...this.langResultTable.values()].map(r => r.code).join(',')},${this.total.comment},${this.total.blank},${this.total.total}`
        ].join('\n');
    }

    toMarkdown(isDetails: boolean = false) {
        const date = new Date();
        return [
            ...this.toMarkdownHeaderLines(date, isDetails),
            '',
            ...this.toMarkdownSummaryLines(),
            '',
            ...this.toMarkdownDetailsLines(isDetails),
        ].join('\n');
    }

    private toMarkdownHeaderLines(date: Date, isDetails: boolean) {
        return [
            `# ${isDetails ? 'Details' : 'Summary'}`,
            '',
            `Date : ${date.toISOString().split('T')[0]}`,
            '',
            `Directory: ${this.targetDir.replace(/\\/g, '\\\\')}`,
            '',
            `Total Files : ${this.total.files}`,
            `Lines of Code : ${this.total.code}`,
            `Comments : ${this.total.comment}`,
            `Blank Lines : ${this.total.blank}`,
            `Total Lines : ${this.total.total}`,
            `Total Tokens : ${this.total.tokenCount.tokens}`,
            '',
            isDetails ? '[Summary](./results.md)' : '[Details](./details.md)',
            '',
        ];
    }

    private toMarkdownSummaryLines() {
        const dirFormat = new MarkdownTableFormatter(this.valueToString,
            { title: 'Path', format: 'string' },
            { title: 'Files', format: 'number' },
            { title: 'Code', format: 'number' },
            { title: 'Comments', format: 'number' },
            { title: 'Blanks', format: 'number' },
            { title: 'Total', format: 'number' },
            { title: 'Tokens', format: 'number' }
        );
        const langFormat = new MarkdownTableFormatter(this.valueToString,
            { title: 'Language', format: 'string' },
            { title: 'Files', format: 'number' },
            { title: 'Code', format: 'number' },
            { title: 'Comments', format: 'number' },
            { title: 'Blanks', format: 'number' },
            { title: 'Total', format: 'number' },
            { title: 'Tokens', format: 'number' }
        );
        return [
            '## Languages',
            ...langFormat.headerLines,
            ...[...this.langResultTable.values()].sort((a, b) => b.code - a.code)
                .map(v => langFormat.line(v.name, v.files, v.code, v.comment, v.blank, v.total, v.tokenCount.tokens)),
            '',
            '## Directories',
            ...dirFormat.headerLines,
            ...[...this.dirResultTable.values()].sort((a, b) => a.name.localeCompare(b.name))
                .map(v => dirFormat.line(v.name.replace(/\\/g, '\\\\'), v.files, v.code, v.comment, v.blank, v.total, v.tokenCount.tokens)),
        ];
    }

    private toMarkdownDetailsLines(isDetails: boolean) {
        if (!isDetails) {
            return [];
        }

        const resultFormat = new MarkdownTableFormatter(this.valueToString,
            { title: 'Filename', format: 'string' },
            { title: 'Language', format: 'string' },
            { title: 'Code', format: 'number' },
            { title: 'Comments', format: 'number' },
            { title: 'Blanks', format: 'number' },
            { title: 'Total', format: 'number' },
            { title: 'Tokens', format: 'number' }
        );

        const byLanguage = new Map<string, Result[]>();
        this.results.forEach(result => {
            const list = byLanguage.get(result.language) || [];
            list.push(result);
            byLanguage.set(result.language, list);
        });

        const sections = [...byLanguage.entries()]
            .sort((a, b) => {
                const totalA = a[1].reduce((sum, r) => sum + r.count.code, 0);
                const totalB = b[1].reduce((sum, r) => sum + r.count.code, 0);
                return totalB - totalA;
            })
            .map(([language, files]) => [
                `### ${language}`,
                '',
                ...resultFormat.headerLines,
                ...files.sort((a, b) => a.filePath.localeCompare(b.filePath))
                    .map(v => resultFormat.line(
                        v.filePath.replace(/\\/g, '\\\\'),
                        v.language,
                        v.count.code,
                        v.count.comment,
                        v.count.blank,
                        v.count.total,
                        v.tokenCount.tokens
                    )),
                ''
            ].join('\n'));

        return [
            '## Files',
            '',
            ...sections
        ];
    }
} 