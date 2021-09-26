import './App.css';
import Request from './component/Request';
import Label from './component/Label';

import { useState } from 'react';

import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const wallets = [ getPhantomWallet() ]

function App() {
  const [isLabelling, setIsLabelling] = useState(false);
  // TODO: This state can be removed when we query the blockchain for data
  const [lastRequest, setLastRequest] = useState(undefined);

  const wallet = useWallet();

  if (!wallet.connected) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div>
        { !isLabelling && <Request wallet={wallet} callback={setLastRequest}/>}
        { isLabelling && <Label wallet={wallet} callback={setLastRequest} lastRequest={lastRequest}/>}
        <p/>
        <button onClick={e => setIsLabelling(prevIsLabelling => !prevIsLabelling)}>Toggle Mode</button>
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