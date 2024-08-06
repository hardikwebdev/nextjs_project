import '../styles/globals.scss'
import Contentlayout from '../shared/layout-components/layout/content-layout'
import Landingpagelayout from '../shared/layout-components/layout/landingpage-layout'
import Switcherlayout from '../shared/layout-components/layout/switcher-layout'
import Authenticationlayout from '../shared/layout-components/layout/authentication-layout'
import SSRProvider from 'react-bootstrap/SSRProvider';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Provider } from 'react-redux';
import store  from '@/shared/redux/store/store'
import { persistor } from '@/shared/redux/store/store'
import { PersistGate } from 'redux-persist/integration/react';
import '../pages/frontend/css/style.css'

const layouts = {
  Contentlayout: Contentlayout,
  Landingpagelayout: Landingpagelayout,
  Switcherlayout: Switcherlayout,
  Authenticationlayout: Authenticationlayout,
};
function MyApp({ Component, pageProps }) {
  const Layout = layouts[Component.layout] || ((pageProps) => <Component>{pageProps}</Component>);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Layout>
        {/* <SSRProvider> */}
        
          <Component {...pageProps} />
        {/* </SSRProvider> */}
      </Layout>
      </PersistGate>
    </Provider>

  )
}

export default MyApp
