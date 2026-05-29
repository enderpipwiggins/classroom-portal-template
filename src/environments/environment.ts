import { generatedConfig } from './generated-config';

export const environment = {
  production: false,
  ...generatedConfig,
};
