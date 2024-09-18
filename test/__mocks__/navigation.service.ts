// navigationServiceMock.js
import NavigationService from '@wavemaker/app-rn-runtime/core/navigation.service';

const mockNavigationService = {
  goToPage: jest.fn(() => Promise.resolve()),
  goBack: jest.fn(() => Promise.resolve()),
  openUrl: jest.fn(() => Promise.resolve()),
};

export default mockNavigationService;
