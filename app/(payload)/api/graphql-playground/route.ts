import config from '@payload-config';
import '@payloadcms/next/css';
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes';

// Disabled automatically in production (graphQL.disablePlaygroundInProduction).
export const GET = GRAPHQL_PLAYGROUND_GET(config);
