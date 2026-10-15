import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import AnalyticsExportMenu from '../AnalyticsExportMenu';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', resolvedLanguage: 'en' },
  }),
}));

const renderMenu = (props, permissions = ['reports.export']) => {
  const store = configureStore({
    reducer: { auth: (state = { permissions }) => state },
  });
  return render(
    <Provider store={store}>
      <AnalyticsExportMenu {...props} />
    </Provider>
  );
};

describe('AnalyticsExportMenu', () => {
  it('opens an accessible menu and exports the selected format', async () => {
    const onExport = jest.fn().mockResolvedValue(undefined);
    renderMenu({ onExport });

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    expect(screen.getByRole('menu')).toBeTruthy();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Excel (XLSX)' }));

    await waitFor(() => expect(onExport).toHaveBeenCalledWith('xlsx'));
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('shows a clear message when exporting fails', async () => {
    const onExport = jest.fn().mockRejectedValue(new Error('failed'));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    renderMenu({ onExport });

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'CSV' }));

    expect((await screen.findByRole('alert')).textContent).toBe('Export failed. Please try again.');
    console.error.mockRestore();
  });

  it('does not expose export actions without export permission', () => {
    renderMenu({ onExport: jest.fn() }, []);
    expect(screen.queryByRole('button', { name: 'Export' })).toBeNull();
  });
});
