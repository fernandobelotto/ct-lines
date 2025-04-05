import { LanguageConf } from './LineCounterTable';

export const internalDefinitions: { [id: string]: Partial<LanguageConf> } = {
    cpp: {
        aliases: ['C++', 'cpp'],
        extensions: ['.cpp', '.hpp', '.cxx', '.hxx', '.cc', '.hh', '.c', '.h'],
        lineComments: ['//'],
        blockComments: [['/*', '*/']],
        blockStrings: [['R("', '")']],
        filenames: [],
        lineStrings: [['"', '"']],
    },
    javascript: {
        aliases: ['JavaScript', 'js'],
        extensions: ['.js', '.jsx', '.mjs', '.cjs'],
        lineComments: ['//'],
        blockComments: [['/*', '*/']],
        blockStrings: [['`', '`']],
        filenames: [],
        lineStrings: [['"', '"'], ["'", "'"]],
    },
    typescript: {
        aliases: ['TypeScript', 'ts'],
        extensions: ['.ts', '.tsx'],
        lineComments: ['//'],
        blockComments: [['/*', '*/']],
        blockStrings: [['`', '`']],
        filenames: [],
        lineStrings: [['"', '"'], ["'", "'"]],
    },
    python: {
        aliases: ['Python', 'py'],
        extensions: ['.py', '.pyw', '.pyi'],
        lineComments: ['#'],
        blockComments: [['"""', '"""'], ["'''", "'''"]],
        blockStrings: [['"""', '"""'], ["'''", "'''"]],
        filenames: [],
        lineStrings: [['"', '"'], ["'", "'"]],
    },
    java: {
        aliases: ['Java'],
        extensions: ['.java'],
        lineComments: ['//'],
        blockComments: [['/*', '*/']],
        blockStrings: [['"""', '"""']],
        filenames: [],
        lineStrings: [['"', '"']],
    },
    go: {
        aliases: ['Go', 'golang'],
        extensions: ['.go'],
        lineComments: ['//'],
        blockComments: [['/*', '*/']],
        blockStrings: [['`', '`']],
        filenames: [],
        lineStrings: [['"', '"']],
    },
    rust: {
        aliases: ['Rust', 'rs'],
        extensions: ['.rs'],
        lineComments: ['//'],
        blockComments: [['/*', '*/']],
        blockStrings: [['r#"', '"#']],
        filenames: [],
        lineStrings: [['"', '"']],
    },
    ruby: {
        aliases: ['Ruby', 'rb'],
        extensions: ['.rb'],
        lineComments: ['#'],
        blockComments: [['=begin', '=end']],
        blockStrings: [['<<~', ''], ['<<-', ''], ['<<', '']],
        filenames: [],
        lineStrings: [['"', '"'], ["'", "'"]],
    },
    php: {
        aliases: ['PHP'],
        extensions: ['.php', '.php3', '.php4', '.php5', '.phtml'],
        lineComments: ['//', '#'],
        blockComments: [['/*', '*/']],
        blockStrings: [['<<<', '']],
        filenames: [],
        lineStrings: [['"', '"'], ["'", "'"]],
    },
    html: {
        aliases: ['HTML'],
        extensions: ['.html', '.htm', '.xhtml'],
        lineComments: [],
        blockComments: [['<!--', '-->']],
        blockStrings: [],
        filenames: [],
        lineStrings: [['"', '"'], ["'", "'"]],
    },
    css: {
        aliases: ['CSS'],
        extensions: ['.css'],
        lineComments: ['/*'],
        blockComments: [['/*', '*/']],
        blockStrings: [],
        filenames: [],
        lineStrings: [['"', '"']],
    },
    json: {
        aliases: ['JSON'],
        extensions: ['.json'],
        lineComments: [],
        blockComments: [],
        blockStrings: [],
        filenames: [],
        lineStrings: [['"', '"']],
    },
    yaml: {
        aliases: ['YAML', 'yml'],
        extensions: ['.yaml', '.yml'],
        lineComments: ['#'],
        blockComments: [],
        blockStrings: [['|', ''], ['>', '']],
        filenames: [],
        lineStrings: [['"', '"'], ["'", "'"]],
    },
    markdown: {
        aliases: ['Markdown', 'md'],
        extensions: ['.md', '.markdown'],
        lineComments: [],
        blockComments: [['<!--', '-->']],
        blockStrings: [['```', '```']],
        filenames: [],
        lineStrings: [],
    },
    bash: {
        aliases: ['Bash', 'sh'],
        extensions: ['.sh', '.bash'],
        lineComments: ['#'],
        blockComments: [],
        blockStrings: [['<<', '']],
        filenames: [],
        lineStrings: [['"', '"'], ["'", "'"]],
    },
    bat: {
        aliases: ['Batch', 'bat'],
        extensions: ['.bat', '.cmd'],
        lineComments: ['::', 'REM', '@REM', 'rem', '@rem'],
        blockComments: [],
        blockStrings: [],
        filenames: [],
        lineStrings: [],
    },
}; 