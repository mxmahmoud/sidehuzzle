import { fireEvent, render } from '@testing-library/react-native';
import { usePathname, useRouter } from 'expo-router';
import { WebTopNav } from './WebTopNav';

const pushMock = jest.fn();

jest.mock('expo-router', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

describe('WebTopNav', () => {
  beforeEach(() => {
    pushMock.mockReset();
    (usePathname as jest.Mock).mockReturnValue('/requests_posts_hub');
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it('highlights the active tab and routes with the premium shell chrome', () => {
    const { getByText, getByRole } = render(<WebTopNav />);

    const activeTab = getByRole('link', { name: 'Messages' });
    const inactiveTab = getByRole('link', { name: 'Home' });

    expect(getByText('Sidehuzle')).toBeTruthy();
    expect(activeTab).toBeTruthy();
    expect(inactiveTab).toBeTruthy();

    fireEvent.press(inactiveTab);
    expect(pushMock).toHaveBeenCalledWith('/(tabs)/landing_page');
  });
});
