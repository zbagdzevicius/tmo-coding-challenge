import { environment } from './environments/environment';
import { Server } from 'hapi';
const H2o2 = require('@hapi/h2o2');

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost'
  });

  await server.register(H2o2);

  const stockData = async (symbol, period) => {
    await server.inject(`/beta/stock/${symbol}/chart/${period}`).then(response => {
      return response.payload;
    });
  };
  server.method('getData', stockData, {
    cache: {
      expiresIn: 60 * 60 * 1000,
      generateTimeout: 5000
    }
  });


  const registerRoutes = () => {
    server.route({
      method: 'GET',
      path: '/api/stock/{symbol}/chart/{period}',
      handler: (request, h) => {
        return server.methods.getData(request.params.symbol, request.params.period);
      }
    });
    
    server.route({
      method: 'GET',
      path: '/beta/stock/{symbol}/chart/{period}',
      options: {
        handler: {
          proxy: {
            uri: `${environment.apiURL}/beta/stock/{symbol}/chart/{period}?token=${environment.apiKey}`,
            passThrough: true,
            xforward: true
          }
        },
        cache: {
          expiresIn: 30 * 10000,
          privacy: 'private'
        }
      }
    });
  }

  registerRoutes();


  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
