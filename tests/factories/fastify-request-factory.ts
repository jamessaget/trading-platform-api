import { FastifyRequest } from 'fastify';

export class FastifyRequestFactory {
    public static make<CustomProperties extends object = {}>(
        customProperties: CustomProperties,
        overrides: Partial<FastifyRequest> = {},
    ): FastifyRequest<{ 
        Params: typeof overrides.params,
        Body: typeof overrides.params,
        Query: typeof overrides.params,
        Headers: typeof overrides.params,
    }> & typeof customProperties {
        return {
            headers: {},
            params: {},
            body: {},
            query: {},
            ...customProperties,
            ...overrides
          } as FastifyRequest<{ 
            Params: typeof overrides.params,
            Body: typeof overrides.body,
            Query: typeof overrides.query,
            Headers: typeof overrides.headers,
        }> & typeof customProperties;
    }
}