import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { products: [] } }) })
    );
    window.scrollTo = jest.fn();
});

afterEach(() => {
    jest.resetAllMocks();
});

test('renders the brand name in the header', () => {
    render(<App />);
    expect(screen.getAllByText(/opevicky/i).length).toBeGreaterThan(0);
});
