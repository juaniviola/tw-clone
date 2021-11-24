import { createApp } from 'vue';
import apolloProvider from './ApolloProvider';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

createApp(App)
  .use(router)
  .use(apolloProvider)
  .mount('#app');
