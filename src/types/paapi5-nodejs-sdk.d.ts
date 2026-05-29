declare module 'paapi5-nodejs-sdk' {
  export interface ApiClientInstance {
    accessKey: string;
    secretKey: string;
    host: string;
    region: string;
  }

  export const ApiClient: {
    instance: ApiClientInstance;
  };

  export class GetItemsRequest {
    [key: string]: unknown;
  }

  export interface PaapiItem {
    ASIN?: string;
    DetailPageURL?: string;
    Images?: {
      Primary?: {
        Large?: { URL?: string };
        Medium?: { URL?: string };
      };
    };
    ItemInfo?: {
      Title?: { DisplayValue?: string };
    };
    Offers?: {
      Listings?: Array<{
        Price?: { DisplayAmount?: string; Amount?: number; Currency?: string };
      }>;
    };
  }

  export interface PaapiGetItemsResponse {
    ItemsResult?: { Items?: PaapiItem[] };
    Errors?: Array<{ Code: string; Message: string }>;
  }

  export const GetItemsResponse: {
    constructFromObject(data: unknown): PaapiGetItemsResponse;
  };

  export class DefaultApi {
    getItems(
      request: GetItemsRequest,
      callback: (error: unknown, data: unknown, response: unknown) => void,
    ): void;
  }

  const _default: {
    ApiClient: typeof ApiClient;
    DefaultApi: typeof DefaultApi;
    GetItemsRequest: typeof GetItemsRequest;
    GetItemsResponse: typeof GetItemsResponse;
  };
  export default _default;
}
