import { fireEvent, render, screen } from '@testing-library/react';
import LearnPage from './LearnPage';
import { openPaystackPopup } from '../services/paystack';

jest.mock('../services/paystack', () => ({ openPaystackPopup: jest.fn() }));

const SERVER_COURSES = { courses: [{ id: 'gypsum-craft', title: 'Gypsum Craft', prices: { online: 40000, physical: 70000 } }] };

// GET /courses returns the price list; POST /enrollments/verify returns `verify`
const mockServer = (verify) => {
    global.fetch = jest.fn((url) => {
        const [status, body] = url.endsWith('/courses') ? [200, SERVER_COURSES] : verify;
        return Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) });
    });
};

afterEach(() => jest.resetAllMocks());

const enrollInGypsum = async () => {
    render(<LearnPage currentUser={{ email: 'ada@mail.com' }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Enroll in Gypsum Craft, Physical Class' }));
    expect(screen.getByLabelText('Email address')).toHaveValue('ada@mail.com');
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Ada Obi' } });
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '08030000000' } });
    fireEvent.click(screen.getByRole('button', { name: /Pay ₦\s?70,000/ }));
    await screen.findByText('Confirming payment…').catch(() => {});
};

test('paying for a course charges the server price and shows the enrollment', async () => {
    mockServer([200, { status: 'success', enrollment: { reference: 'REF1' } }]);
    openPaystackPopup.mockImplementation(async ({ onSuccess }) => onSuccess('REF1'));

    await enrollInGypsum();

    expect(await screen.findByText("You're Enrolled")).toBeInTheDocument();
    const popup = openPaystackPopup.mock.calls[0][0];
    expect(popup.amount).toBe(70000);
    expect(popup.metadata).toMatchObject({ type: 'enrollment', courseId: 'gypsum-craft', format: 'physical', student: { name: 'Ada Obi', email: 'ada@mail.com', phone: '08030000000' } });
    const verifyCall = global.fetch.mock.calls.find(([url]) => url.endsWith('/enrollments/verify'));
    expect(JSON.parse(verifyCall[1].body)).toMatchObject({ reference: 'REF1', courseId: 'gypsum-craft', format: 'physical' });
    expect(screen.getByText('REF1')).toBeInTheDocument();
});

test('if the server cannot confirm, the student is told not to pay again', async () => {
    mockServer([502, { status: 'fail', paymentReceived: true, message: 'Your payment was received (reference REF2). Please do not pay again.' }]);
    openPaystackPopup.mockImplementation(async ({ onSuccess }) => onSuccess('REF2'));

    await enrollInGypsum();

    expect(await screen.findByText('Payment Received')).toBeInTheDocument();
    expect(screen.getByText(/Please do not pay again/)).toBeInTheDocument();
});
