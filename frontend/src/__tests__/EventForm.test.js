import { render, screen, fireEvent } from '@testing-library/react';
import EventForm from '../components/EventForm';

describe('EventForm', () => {
  const mockSubmit = jest.fn();
  const categories = ['Music', 'Food', 'Tech'];

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  test('renders all required fields', () => {
    render(
      <EventForm
        initialData={{ title: '', date: '', category: '', price: '' }}
        categories={categories}
        onSubmit={mockSubmit}
        submitLabel="Create"
      />
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  test('submits form with correct data', () => {
    render(
      <EventForm
        initialData={{}}
        categories={categories}
        onSubmit={mockSubmit}
        submitLabel="Create"
      />
    );

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Concert' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-12-12' } });

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Concert',
        date: '2025-12-12',
      })
    );
  });
});
