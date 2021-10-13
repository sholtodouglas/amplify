import './App.css';
import Request from './components/Request';
import Label from './components/Label';
import Display from './components/Display';

import { useState } from 'react';

import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';


import { withRouter, Switch } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';

// Layouts
import LayoutDefault from './layouts/LayoutDefault';
import LayoutAlternative from './layouts/LayoutAlternative';
import LayoutSignin from './layouts/LayoutSignin';

// Views 
import Home from './views/Home';
import Secondary from './views/Secondary';
import Login from './views/Login';
import Signup from './views/Signup';



// import "./App.css";
import './assets/scss/style.scss';



const wallets = [ getPhantomWallet() ]

function App() {
  const [mode, setMode] = useState("");
  const wallet = useWallet();
  const modes = ["request", "label", "display"];

  if (!wallet.connected) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div>
        {/* { mode === "request" && <Request wallet={wallet} />}
        { mode === "label" && <Label wallet={wallet} />}
        { mode === "display" && <Display wallet={wallet} />}
        { mode === "" && modes.map(e => (
          <div key={e}>
            <p/>
            <button key={e} onClick={() => setMode(e)}>{e.toUpperCase()}</button>
          </div>
        ))} */}
        <ScrollReveal
        children={() => (
          <Switch>
            <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
            <AppRoute exact path="/secondary" component={Label} layout={LayoutDefault} wallet={wallet}/>
            <AppRoute exact path="/request" component={Request} wallet={wallet}/>
            {/* <AppRoute exact path="/secondary" render={(props) => <Label {...props} wallet={wallet} />} /> */}
            {/* <AppRoute exact path="/secondary" component={Secondary} layout={LayoutAlternative} /> */}
            <AppRoute exact path="/login" component={Login} layout={LayoutSignin} />
            <AppRoute exact path="/signup" component={Signup} layout={LayoutSignin} />
          </Switch>
        )} />
      </div>
    );
  }
}

const AppWithProvider = () => (
  <ConnectionProvider endpoint="http://127.0.0.1:8899">
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;