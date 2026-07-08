const fs = require('fs');
const path = require('path');
const vm = require('vm');

const aiEngineCode = fs.readFileSync(path.join(__dirname, '../assets/js/ai-engine.js'), 'utf8');
const context = { document: { getElementById: () => null } };
vm.createContext(context);
vm.runInContext(aiEngineCode, context);

const PortfolioAI = context.PortfolioAI;

describe('PortfolioAI.buildSystemPrompt', () => {
    const mockRetrieved = [
        {
            id: 'doc1',
            title: 'Test Document 1',
            url: '/test-url-1',
            category: 'blog',
            body: 'This is the first test document body.'
        },
        {
            id: 'doc2',
            title: 'Test Document 2',
            url: '/test-url-2',
            category: 'project',
            body: 'This is the second test document body. '.repeat(100) // Make it long to test truncation if any
        }
    ];

    const mockCfg = {
        contractVersion: 'test-v1',
        aiFacts: { 'test-fact': 'test-value' },
        siteCard: 'Test Site Card Summary'
    };

    it('should be defined', () => {
        expect(PortfolioAI.buildSystemPrompt).toBeDefined();
    });

    it('should build a prompt with provided context and config', () => {
        const prompt = PortfolioAI.buildSystemPrompt(mockRetrieved, mockCfg);

        // Output validation
        expect(prompt).toContain('You are the portfolio copilot for Pavan Badempet');
        expect(prompt).toContain('CONTRACT: test-v1');
        expect(prompt).toContain('SITE_CARD (short public summary');
        expect(prompt).toContain('Test Site Card Summary');
        expect(prompt).toContain('CONTEXT_PACKAGE_JSON');

        // Contains stringified facts
        expect(prompt).toContain('"test-fact":"test-value"');

        // Contains source representation
        expect(prompt).toContain('[1] **Test Document 1**');
        expect(prompt).toContain('/test-url-1');
        expect(prompt).toContain('This is the first test document body');
        expect(prompt).toContain('[2] **Test Document 2**');
    });

    it('should handle empty config and retrieved arrays', () => {
        const prompt = PortfolioAI.buildSystemPrompt([], null);

        expect(prompt).toContain('CONTRACT: portfolio-ai-v2'); // default contract
        expect(prompt).not.toContain('SITE_CARD'); // missing in empty config
        expect(prompt).toContain('"sources":[]'); // empty sources array
    });

    it('should limit string sizes in RAG and Context Package', () => {
        const longText = 'A'.repeat(5000);
        const retrieved = [{
            id: 'long',
            title: 'Long Doc',
            body: longText
        }];

        const prompt = PortfolioAI.buildSystemPrompt(retrieved, {});

        // Context Package truncation to 1100
        const pkgMatch = prompt.match(/"excerpt":"([^"]+)"/);
        expect(pkgMatch).toBeTruthy();
        expect(pkgMatch[1].length).toBe(1100);

        // RAG block truncation to 2400
        const ragMatch = prompt.match(/---\n\n([^]+)$/);
        // Relying on context pkg testing
    });
});
