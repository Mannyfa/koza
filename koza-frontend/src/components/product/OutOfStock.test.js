import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';
import ProductDetailPage from '../../pages/ProductDetailPage';

const base = { id: 'p1', name: 'Oud Royale', price: 20000, image: 'https://example.com/a.jpg', stockAmount: 5 };
const noop = () => {};

test('card shows the Out of Stock badge when the admin switch is on', () => {
    render(<ProductCard product={{ ...base, isOutOfStock: true }} onProductClick={noop} />);
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    expect(screen.getByText(/sold out/i)).toBeInTheDocument();
    expect(screen.queryByText(/available/i)).not.toBeInTheDocument();
});

test('card shows the badge when stock count is 0', () => {
    render(<ProductCard product={{ ...base, stockAmount: 0 }} onProductClick={noop} />);
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
});

test('card has no badge for an in-stock product', () => {
    render(<ProductCard product={base} onProductClick={noop} />);
    expect(screen.queryByText(/out of stock/i)).not.toBeInTheDocument();
    expect(screen.getByText('5 Available')).toBeInTheDocument();
});

test('product page shows the badge and disables Add to Bag when switched off', () => {
    render(<ProductDetailPage product={{ ...base, isOutOfStock: true }} onAddToCart={noop} onBack={noop} orders={[]} onSubmitReview={noop} />);
    // badge on the image + label in the details + the disabled button
    expect(screen.getAllByText(/out of stock/i).length).toBeGreaterThanOrEqual(3);
    expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled();
});
