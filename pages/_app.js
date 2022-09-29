import Naviagtion from '../components/Navigation'
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function MyApp({ Component, pageProps }) {
    return (
        <div className='mt-5' style={{ paddingBottom: 55 }}>
            <Component {...pageProps} />
            <Naviagtion />
        </div>
    )
}

export default MyApp
