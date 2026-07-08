const fs = require('fs');
const path = require('path');

// Read the ai-engine.js source
const srcPath = path.resolve(__dirname, '../assets/js/ai-engine.js');
const src = fs.readFileSync(srcPath, 'utf8');

// Mock DOM elements that might be used by the script
global.document = {
    getElementById: jest.fn().mockReturnValue(null),
};

// Evaluate the script in the global context
eval(src);

describe('buildContextPackage', () => {
    // Get the exposed function from the global object
    const PortfolioAI = global.PortfolioAI || this.PortfolioAI;
    const buildContextPackage = PortfolioAI.buildContextPackage;

    it('should build context package correctly with valid cfg', () => {
        const retrieved = [
            { id: '1', category: 'doc', title: 'Test Document', url: '/test', body: 'Test body content' }
        ];
        const cfg = { contractVersion: 'custom-contract-v1', aiFacts: { someFact: 'value' } };

        const result = buildContextPackage(retrieved, cfg);

        expect(result.task).toBe('answer_question');
        expect(result.contract).toBe('custom-contract-v1');
        expect(result.facts).toEqual({ someFact: 'value' });
        expect(result.sources).toHaveLength(1);
        expect(result.sources[0].id).toBe('1');
        expect(result.sources[0].type).toBe('doc');
        expect(result.sources[0].title).toBe('Test Document');
        expect(result.sources[0].route).toBe('/test');
        expect(result.sources[0].excerpt).toBe('Test body content');
    });

    it('should build context package with fallback values when cfg is undefined', () => {
        const retrieved = [
            { id: '2', title: 'Doc Without Category', url: '/test2', body: 'Body 2' }
        ];

        const result = buildContextPackage(retrieved, undefined);

        expect(result.task).toBe('answer_question');
        expect(result.contract).toBe('portfolio-ai-v2');
        expect(result.facts).toEqual({});
        expect(result.sources).toHaveLength(1);
        expect(result.sources[0].id).toBe('2');
        expect(result.sources[0].type).toBe('document'); // Fallback category
    });

    it('should build context package with fallback values when cfg is null', () => {
        const retrieved = [
            { id: '3', title: 'Doc 3', url: '/test3', body: 'Body 3' }
        ];

        const result = buildContextPackage(retrieved, null);

        expect(result.task).toBe('answer_question');
        expect(result.contract).toBe('portfolio-ai-v2');
        expect(result.facts).toEqual({});
        expect(result.sources).toHaveLength(1);
        expect(result.sources[0].id).toBe('3');
    });
});
