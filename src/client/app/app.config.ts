import { OpaqueToken } from '@angular/core';

export let APP_CONFIG = new OpaqueToken('app.config');

export interface IAppConfig {
  dimensions: {
    phone: {
      min?: number,
      max: number
    },
    tablet: {
      min: number,
      max: number
    },
    desktop: {
      min: number,
      max?: number
    }
  };
}

export const AppConfig: IAppConfig = {
  dimensions: {
    phone: {
      min: null,
      max: 767
    },
    tablet: {
      min: 768,
      max: 1024
    },
    desktop: {
      min: 1025,
      max: null
    }
  }
};
