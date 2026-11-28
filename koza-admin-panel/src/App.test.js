import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';
import { FeedbackProvider } from './components/Feedback';
import { clearResourceCache } from './hooks/useCachedResource';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';

jest.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    LineChart: ({ children }) => <div>{children}</div>,
    Line: () => null, XAxis: () => null, YAxis: () => null, CartesianGrid: () => null, Tooltip: () => null,
}));

const json = (status, body) => Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) });

const PRODUCTS = [
    { _id: 'p1', name: 'Oud Royale', price: 30000, bottleSize: '50ml', stockAmount: 5, isActive: true, category: 'Perfume' },
    { _id: 'p2', name: 'Liora Diffuser', price: 12000, bottleSize: '100ml', stockAmount: 9, isActive: true, category: 'Diffuser' },
];

/** Fake backend: answers by method + path, records every call. */
const mockServer = (routes) => {
    global.fetch = jest.fn((url, options = {}) => {
        const key = `${options.method || 'GET'} ${url.replace(/^.*\/api/, '')}`;
        const handler = routes[key];
        if (!handler) throw new Error(`Unexpected request: ${key}`);
        return handler(options);
    });
};

const renderWithFeedback = (ui) => render(<FeedbackProvider>{ui}</FeedbackProvider>);
const callsTo = (key) => global.fetch.mock.calls.filter(([url, o = {}]) => `${o.method || 'GET'} ${url.replace(/^.*\/api/, '')}` === key);

beforeEach(() => {
    clearResourceCache();
    localStorage.clear();
    window.alert = jest.fn();
    window.confirm = jest.fn();
});

test('shows the login screen when signed out', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument();
});

test('editing a product updates the row in place, with an in-app notice and no reload', async () => {
    mockServer({
        'GET /products': () => json(200, { data: { products: PRODUCTS } }),
        'GET /products/categories': () => json(200, { categories: ['Perfume', 'Diffuser', 'Car Diffuser'] }),
        'PUT /products/p1': () => json(200, { data: { product: { ...PRODUCTS[0], name: 'Oud Royale Intense', category: 'Car Diffuser' } } }),
    });
    renderWithFeedback(<ProductsPage adminRole="manager" />);

    const row = (await screen.findByText('Oud Royale')).closest('tr');
    fireEvent.click(within(row).getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('option', { name: 'Car Diffuser' })).toBeInTheDocument(); // list came from the backend
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(await screen.findByRole('status')).toHaveTextContent('"Oud Royale Intense" updated');
    expect(screen.getByText('Oud Royale Intense')).toBeInTheDocument();
    expect(screen.queryByText(/loading products/i)).not.toBeInTheDocument();
    expect(callsTo('GET /products')).toHaveLength(1); // the list was not downloaded again
    expect(window.alert).not.toHaveBeenCalled();
});

test('deleting asks in an in-app dialog and removes only that row', async () => {
    mockServer({
        'GET /products': () => json(200, { data: { products: PRODUCTS } }),
        'GET /products/categories': () => json(200, { categories: ['Perfume'] }),
        'DELETE /products/p2': () => Promise.resolve({ ok: true, status: 204, json: () => Promise.resolve(null) }),
    });
    renderWithFeedback(<ProductsPage adminRole="superadmin" />);

    const row = (await screen.findByText('Liora Diffuser')).closest('tr');
    fireEvent.click(within(row).getByRole('button', { name: 'Delete' }));
    const dialog = await screen.findByRole('alertdialog');
    expect(dialog).toHaveTextContent('Liora Diffuser');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(screen.queryByText('Liora Diffuser')).not.toBeInTheDocument());
    expect(screen.getByText('Oud Royale')).toBeInTheDocument();
    expect(window.confirm).not.toHaveBeenCalled();
});

test('a failed save shows the error and keeps the form open', async () => {
    mockServer({
        'GET /products': () => json(200, { data: { products: PRODUCTS } }),
        'GET /products/categories': () => json(200, { categories: ['Perfume'] }),
        'PUT /products/p1': () => json(400, { message: 'Price must be a number' }),
    });
    renderWithFeedback(<ProductsPage adminRole="manager" />);
    fireEvent.click(within((await screen.findByText('Oud Royale')).closest('tr')).getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Price must be a number');
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
});

test('order status changes instantly and rolls back if the server refuses', async () => {
    const orders = [{ id: 'aaaaaaaaaaaa111111', reference: 'R1', status: 'Processing', total: 5000, date: '2026-11-01', customer: { name: 'Ada', email: 'ada@x.com' }, cart: [] }];
    let fail = false;
    mockServer({
        'GET /orders': () => json(200, { data: { orders } }),
        'PATCH /orders/aaaaaaaaaaaa111111/status': () => (fail ? json(500, { message: 'Email service down' }) : json(200, { order: {} })),
    });
    renderWithFeedback(<OrdersPage adminRole="manager" />);

    const select = await screen.findByLabelText('Status for order 111111');
    fireEvent.change(select, { target: { value: 'Shipped' } });
    expect(select).toHaveValue('Shipped');
    expect(await screen.findByRole('status')).toHaveTextContent('Order #111111 marked Shipped');

    fail = true;
    fireEvent.change(select, { target: { value: 'Delivered' } });
    expect(await screen.findByRole('alert')).toHaveTextContent('Email service down');
    await waitFor(() => expect(select).toHaveValue('Shipped'));
    expect(callsTo('GET /orders')).toHaveLength(1);
});

test('cancelling an order needs confirmation in the app', async () => {
    const orders = [{ id: 'bbbbbbbbbbbb222222', reference: 'R2', status: 'Processing', total: 5000, date: '2026-11-01', customer: { name: 'Bayo', email: 'b@x.com' }, cart: [] }];
    mockServer({
        'GET /orders': () => json(200, { data: { orders } }),
        'PATCH /orders/bbbbbbbbbbbb222222/status': () => json(200, { order: {} }),
    });
    renderWithFeedback(<OrdersPage adminRole="manager" />);

    const select = await screen.findByLabelText('Status for order 222222');
    fireEvent.change(select, { target: { value: 'Cancelled' } });
    fireEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Keep order' }));
    expect(select).toHaveValue('Processing');
    expect(callsTo('PATCH /orders/bbbbbbbbbbbb222222/status')).toHaveLength(0);
});

test('settings shows whether payments can be confirmed and the webhook address', async () => {
    const SettingsPage = require('./pages/SettingsPage').default;
    mockServer({
        'GET /admin/users': () => json(200, [{ _id: 'a1', name: 'Ope', email: 'ope@x.com', role: 'superadmin' }]),
        'GET /admin/payments-status': () => json(200, {
            ok: false, mode: 'live',
            message: 'Paystack rejected the secret key (Invalid key). Paste the current live secret key into PAYSTACK_SECRET_KEY on Render.',
            webhookUrl: 'https://koza-2fkh.onrender.com/api/payments/webhook',
        }),
    });
    renderWithFeedback(<SettingsPage />);
    expect(await screen.findByText(/payments cannot be confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/rejected the secret key/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Webhook address')).toHaveValue('https://koza-2fkh.onrender.com/api/payments/webhook');
});
