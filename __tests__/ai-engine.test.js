const fs = require('fs');
const vm = require('vm');
const path = require('path');

const code = fs.readFileSync(path.resolve(__dirname, '../assets/js/ai-engine.js'), 'utf-8');

describe('getOllamaChatUrl', () => {
    let globalEnv;
    let getOllamaChatUrl;

    beforeEach(() => {
        globalEnv = {
            window: {},
            document: {
                getElementById: jest.fn().mockReturnValue(null)
            }
        };
        vm.createContext(globalEnv);
        vm.runInContext(code, globalEnv);
        getOllamaChatUrl = globalEnv.window.PortfolioAI.getOllamaChatUrl;
    });

    test('should return default localhost URL when no config is provided', () => {
        expect(getOllamaChatUrl()).toBe('http://127.0.0.1:11434/api/chat');
    });

    test('should return default localhost URL when config is empty', () => {
        expect(getOllamaChatUrl({})).toBe('http://127.0.0.1:11434/api/chat');
    });

    test('should append /api/chat when a base URL is provided', () => {
        expect(getOllamaChatUrl({ ollamaBaseUrl: 'http://example.com:11434' })).toBe('http://example.com:11434/api/chat');
    });

    test('should not append /api/chat when the URL already ends with it', () => {
        expect(getOllamaChatUrl({ ollamaBaseUrl: 'http://example.com:11434/api/chat' })).toBe('http://example.com:11434/api/chat');
    });

    test('should remove trailing slash and append /api/chat', () => {
        expect(getOllamaChatUrl({ ollamaBaseUrl: 'http://example.com:11434/' })).toBe('http://example.com:11434/api/chat');
    });

    test('should handle URL with trailing slash and already containing /api/chat', () => {
        expect(getOllamaChatUrl({ ollamaBaseUrl: 'http://example.com:11434/api/chat/' })).toBe('http://example.com:11434/api/chat');
    });

    test('should handle whitespace in config', () => {
        expect(getOllamaChatUrl({ ollamaBaseUrl: '  http://example.com:11434  ' })).toBe('http://example.com:11434/api/chat');
    });

    test('should handle non-string config values safely', () => {
        expect(getOllamaChatUrl({ ollamaBaseUrl: null })).toBe('http://127.0.0.1:11434/api/chat');
        expect(getOllamaChatUrl({ ollamaBaseUrl: undefined })).toBe('http://127.0.0.1:11434/api/chat');
    });

    test('should handle /api/chat appearing earlier in the URL path incorrectly, e.g., /api/chat/something/else', () => {
        expect(getOllamaChatUrl({ ollamaBaseUrl: 'http://example.com/api/chat/v1/custom' })).toBe('http://example.com/api/chat/v1/custom');
    });

    test('should handle weird inputs converting to strings like true or objects', () => {
        expect(getOllamaChatUrl({ ollamaBaseUrl: true })).toBe('true/api/chat');
        expect(getOllamaChatUrl({ ollamaBaseUrl: {} })).toBe('[object Object]/api/chat');
    });
});
