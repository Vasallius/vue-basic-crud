import { createAuth0 } from '@auth0/auth0-vue'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.use(
  createAuth0({
    domain: 'dev-c0iwxt3xwegmt1yf.us.auth0.com',
    clientId: 'P1YdB22IWWksIFmhEa6UQQ9WRL4OYipz',
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  })
)

app.mount('#app')
