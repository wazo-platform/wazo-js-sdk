import { ApiRequester, BaseApiClient, WazoApiClient } from '../..';
import { ConstructorParams } from '../../base-api-client';
import getApiClient from '../getApiClient';

describe('getApiClient', () => {
  it('should return WazoApiClient by default', () => {
    const globalClient = getApiClient();
    expect(globalClient).toBeInstanceOf(WazoApiClient);
    expect(globalClient.amid).toBeDefined();

    const serverClient = getApiClient('wazo-platorm.org');
    expect(serverClient).toBeInstanceOf(WazoApiClient);
    expect(globalClient.amid).toBeDefined();
  });

  it.only('should return custom ApiClient', () => {
    const fooMethods = (client: ApiRequester, baseUrl: string) => ({
      test: (myString: string) => ({ client, myString, baseUrl }),
    });

    class FooApiClient extends BaseApiClient {
      public foo: ReturnType<typeof fooMethods>;

      constructor(args: ConstructorParams) {
        super(args);
        this.initializeEndpoints();
      }

      initializeEndpoints() {
        super.initializeEndpoints();
        this.foo = fooMethods(this.client, 'foo/0.1');
      }
    }

    const extendedClient = getApiClient<FooApiClient>('foo.wazo-platform.org', FooApiClient);
    expect(extendedClient).toBeInstanceOf(FooApiClient);
    expect(extendedClient.auth).toBeDefined();
    // @ts-ignore: we know amid is undefined, it's important to test it
    expect(extendedClient.amid).not.toBeDefined();

    const fooTest = extendedClient.foo?.test('foo');
    expect(fooTest.myString).toBe('foo');
    expect(fooTest.client).toBeInstanceOf(ApiRequester);
    expect(fooTest.baseUrl).toBe('foo/0.1');
  });
});
