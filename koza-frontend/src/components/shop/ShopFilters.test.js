import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import ShopFilters from './ShopFilters';
import { DEFAULT_FILTERS } from '../../utils/filters';

const categories = [{ name: 'Antiperspirant', count: 23 }, { name: 'Body Mist', count: 72 }, { name: 'Car Diffuser', count: 4 }];

const Harness = () => {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    return (
        <>
            <ShopFilters filters={filters} onChange={setFilters} categories={categories} totalCount={447} resultCount={447} />
            <output data-testid="category">{filters.category}</output>
        </>
    );
};

test('categories sit behind a single "Filter by category" button, not a scrolling row', () => {
    render(<Harness />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.queryByText('Antiperspirant')).not.toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'Filter by category' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);

    const list = screen.getByRole('listbox', { name: 'Categories' });
    const options = within(list).getAllByRole('option');
    expect(options.map((o) => o.textContent)).toEqual(['All categories447', 'Antiperspirant23', 'Body Mist72', 'Car Diffuser4']);
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
});

test('choosing a category filters, closes the list and shows the choice on the button', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Filter by category' }));
    fireEvent.click(screen.getByRole('option', { name: /body mist/i }));

    expect(screen.getByTestId('category')).toHaveTextContent('Body Mist');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Category: Body Mist/ })).toHaveTextContent('Body Mist');

    fireEvent.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(screen.getByTestId('category')).toHaveTextContent('All');
});

test('Escape and clicking elsewhere close the list', () => {
    render(<Harness />);
    const button = screen.getByRole('button', { name: 'Filter by category' });
    fireEvent.click(button);
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    fireEvent.click(button);
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});
