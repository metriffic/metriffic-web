import { config } from './config.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import WebSocket from 'ws';
import { ApolloClient, InMemoryCache } from '@apollo/client/core/core.cjs';
import { WebSocketLink } from '@apollo/client/link/ws/ws.cjs';
import { SubscriptionClient } from 'subscriptions-transport-ws';


class MetrifficGQL {
  constructor() {
    const options = {
      algorithm: 'RS256',
    };
    
    const web_client_private_key = fs.readFileSync(
      config.WEB_CLIENT_PRIVATE_KEY_FILE,
      'utf8'
    );
    const token = jwt.sign({ who: config.GQL_ENDPOINT }, web_client_private_key, options);
    
    const WS_ENDPOINT = config.GQL_ADDRESS;
    console.log('[MC] initializing metriffic client to ', WS_ENDPOINT);

    const wsClient = new SubscriptionClient(
      WS_ENDPOINT,
      {
        reconnect: true,
      },
      WebSocket
    );
    const link = new WebSocketLink(wsClient);

    // https://github.com/apollographql/apollo-link/issues/446
    const subscriptionMiddleware = {
      applyMiddleware: function (payload, next) {
        // set it on the `payload` which will be passed to the websocket with Apollo
        // Server it becomes: `ApolloServer({contetx: ({payload}) => (returns options)
        payload.authorization = 'Bearer ' + token;
        payload.endpoint = config.GQL_ENDPOINT;
        next();
      },
    };
    link.subscriptionClient.use([subscriptionMiddleware]);

    const cache = new InMemoryCache({});

    this.gql = new ApolloClient({
      link,
      cache,
    });
  }
}

const metriffic_client = new MetrifficGQL();
export { metriffic_client };

