import { createApp } from 'vue';
import apolloProvider from './utils/ApolloProvider';
import App from './App.vue';
import router from './router';

createApp(App)
  .use(router)
  .use(apolloProvider)
  .mount('#app');
