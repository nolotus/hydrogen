import {ServerAnalyticsRoute} from '../ServerAnalyticsRoute';

const createRequest = () => {
  return new Request('__event', {
    headers: {
      'Content-Length': '0',
    },
  });
};

describe('Analytics - ServerAnalyticsRoute', () => {
  it('should return a 200 response', async () => {
    const response = await ServerAnalyticsRoute(createRequest(), {
      hydrogenConfig: {},
    });
    expect(response.status).toEqual(200);
  });

  it('should delegate request to a server analytics connector', async () => {
    const mockServerAnalyticsConnector = jest.fn();
    const request = createRequest();
    const response = await ServerAnalyticsRoute(request, {
      hydrogenConfig: {
        serverAnalyticsConnectors: [
          {
            request: mockServerAnalyticsConnector,
          },
        ],
      },
    });

    expect(response.status).toEqual(200);
    expect(mockServerAnalyticsConnector).toHaveBeenCalled();
    expect(mockServerAnalyticsConnector.mock.calls[0][0]).toEqual(request);
  });

  it('should delegate request to multiple server analytics connectors', async () => {
    const mockServerAnalyticsConnector1 = jest.fn();
    const mockServerAnalyticsConnector2 = jest.fn();
    const request = createRequest();
    const response = await ServerAnalyticsRoute(request, {
      hydrogenConfig: {
        serverAnalyticsConnectors: [
          {
            request: mockServerAnalyticsConnector1,
          },
          {
            request: mockServerAnalyticsConnector2,
          },
        ],
      },
    });

    expect(response.status).toEqual(200);
    expect(mockServerAnalyticsConnector1).toHaveBeenCalled();
    expect(mockServerAnalyticsConnector1.mock.calls[0][0]).toEqual(request);
    expect(mockServerAnalyticsConnector2).toHaveBeenCalled();
    expect(mockServerAnalyticsConnector2.mock.calls[0][0]).toEqual(request);
  });

  it('should delegate json request', async (done) => {
    const testRequest = new Request('__event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test: '123',
      }),
    });

    const mockServerAnalyticsConnector = (
      request: Request,
      data?: any,
      type?: string
    ): void => {
      expect(request).toEqual(testRequest);
      expect(data).toEqual({
        test: '123',
      });
      expect(type).toEqual('json');
      done();
    };

    const response = await ServerAnalyticsRoute(testRequest, {
      hydrogenConfig: {
        serverAnalyticsConnectors: [
          {
            request: mockServerAnalyticsConnector,
          },
        ],
      },
    });

    expect(response.status).toEqual(200);
  });

  it('should delegate text request', async (done) => {
    const testRequest = new Request('__event', {
      method: 'POST',
      body: 'test123',
    });
    const mockServerAnalyticsConnector = (
      request: Request,
      data?: any,
      type?: string
    ): void => {
      expect(request).toEqual(testRequest);
      expect(data).toEqual('test123');
      expect(type).toEqual('text');
      done();
    };
    const response = await ServerAnalyticsRoute(testRequest, {
      hydrogenConfig: {
        serverAnalyticsConnectors: [
          {
            request: mockServerAnalyticsConnector,
          },
        ],
      },
    });

    expect(response.status).toEqual(200);
  });
});
