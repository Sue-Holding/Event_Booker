import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddNewEvent from '../components/AddNewEvent';

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Event created successfully' }),
  })
);

// Mock jwtDecode to simulate an organiser token
jest.mock('jwt-decode', () => ({
  jwtDecode: () => ({ role: 'organiser', name: 'Test User' }),
}));

describe('AddNewEvent', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake.jwt.token');
    fetch.mockClear();
  });

  test('renders form and submits event', async () => {
    render(<AddNewEvent />);

    // Wait for categories to load
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const submitBtn = await screen.findByRole('button', { name: /create event/i });
    expect(submitBtn).toBeInTheDocument();
  });

  test('shows success message after submission', async () => {
    render(<AddNewEvent />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-12-12' } });
    fireEvent.change(screen.getByLabelText(/time/i), { target: { value: '18:00' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'Test Venue' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create event/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/event posted successfully/i)
      ).toBeInTheDocument()
    );
  });
});