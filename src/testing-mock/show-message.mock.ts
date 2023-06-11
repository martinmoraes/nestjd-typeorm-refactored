import { ShowMessageService } from '../show-message/show-message.service';

export const showMessageMock = {
  imports: ShowMessageService,
  useValue: {
    showMessage: jest.fn(),
  },
};
