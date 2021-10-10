import './App.css';
import Request from './component/Request';
import Label from './component/Label';
import Display from './component/Display';

import { useState } from 'react';

import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';



import "./App.css";


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
        { mode === "request" && <Request wallet={wallet} />}
        { mode === "label" && <Label wallet={wallet} />}
        { mode === "display" && <Display wallet={wallet} />}
        { mode === "" && modes.map(e => (
          <div key={e}>
            <p/>
            <button key={e} onClick={() => setMode(e)}>{e.toUpperCase()}</button>
          </div>
        ))}
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