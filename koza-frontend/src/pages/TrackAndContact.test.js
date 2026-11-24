import { fireEvent, render, screen } from '@testing-library/react';
import TrackOrderPage from './TrackOrderPage';
import ContactPage from './ContactPage';

const mockFetch = (status, body) => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) }));
};

afterEach(() => jest.resetAllMocks());

test('track page shows the order status and items', async () => {
    mockFetch(200, {
        order: {
            orderNumber: 'A1B2C3', status: 'Shipped', date: '2026-11-20T10:00:00Z', total: 54000, city: 'Ikeja', state: 'Lagos',
            items: [{ name: 'Oud Royale', quantity: 2, price: 27000, bottleSize: '50ml', image: '' }],
        },
    });
    render(<TrackOrderPage onNavigate={() => {}} />);
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'me@mail.com' } });
    fireEvent.change(screen.getByLabelText('Order number'), { target: { value: '#a1b2c3' } });
    fireEvent.click(screen.getByRole('button', { name: /track order/i }));

    expect(await screen.findByText(/Order #A1B2C3/)).toBeInTheDocument();
    expect(screen.getByText('Oud Royale')).toBeInTheDocument();
    expect(screen.getByText(/on its way/i)).toBeInTheDocument();
    expect(screen.getByText(/Ikeja, Lagos/)).toBeInTheDocument();

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/api\/orders\/track$/);
    expect(JSON.parse(options.body)).toEqual({ email: 'me@mail.com', orderNumber: '#a1b2c3' });
});

test('track page shows the server error when nothing matches', async () => {
    mockFetch(404, { message: 'We could not find an order with those details.' });
    render(<TrackOrderPage onNavigate={() => {}} initialEmail="me@mail.com" initialOrderNumber="ZZZZZZ" />);
    fireEvent.click(screen.getByRole('button', { name: /track order/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not find an order/i);
});

test('contact form sends the message and clears on success', async () => {
    mockFetch(200, { message: 'Thank you! We will get back to you shortly.' });
    render(<ContactPage onNavigate={() => {}} />);
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'ada@mail.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Do you ship to Abuja?' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/thank you/i);
    expect(screen.getByLabelText('Full name')).toHaveValue('');
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body).toMatchObject({ name: 'Ada', email: 'ada@mail.com', message: 'Do you ship to Abuja?', subject: 'General enquiry' });
});

test('contact form shows rate-limit errors from the server', async () => {
    mockFetch(429, { message: 'You have sent several messages already.' });
    render(<ContactPage onNavigate={() => {}} />);
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'ada@mail.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hi' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByRole('status')).toHaveTextContent(/several messages/i);
});
