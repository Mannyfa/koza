import { render, screen } from '@testing-library/react';
import OrderConfirmationPage from './OrderConfirmationPage';

test('a paid order that could not be confirmed shows "Payment Received", never "try again"', () => {
    render(<OrderConfirmationPage onNavigate={() => {}} pending={{ reference: '1764200000000', message: 'Your payment was received (reference 1764200000000). Please do not pay again.' }} />);
    expect(screen.getByRole('heading', { name: /payment received/i })).toBeInTheDocument();
    expect(screen.getByText('1764200000000')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/do not pay again/i);
    expect(screen.queryByText(/transaction approved/i)).not.toBeInTheDocument();
});

test('a confirmed order still shows the normal confirmation', () => {
    render(<OrderConfirmationPage onNavigate={() => {}} order={{ _id: '69f314d4fb0efd9e458427f1' }} isSignedIn />);
    expect(screen.getByRole('heading', { name: /transaction approved/i })).toBeInTheDocument();
    expect(screen.getByText('#8427F1')).toBeInTheDocument();
});
