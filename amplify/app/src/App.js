import './App.css';
import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import idl from './idl.json';

import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const wallets = [ getPhantomWallet() ]

const { SystemProgram, Keypair } = web3;
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function App() {
  const [image, setImage] = useState('');
  const [categories, setCategories] = useState('');
  const [min_rating, setMinRating] = useState(0);
  const wallet = useWallet();

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }

  async function initialize() {    
    const provider = await getProvider();
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl, programID, provider);
    const request = Keypair.generate();

    try {
      /* interact with the program via rpc */
      await program.rpc.initialize(
        image,
        categories,
        Math.floor(parseFloat(min_rating) * 1e8) >>> 0,
        {
          accounts: {
            request: request.publicKey,
            requester: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [request]
        }
      );

      const account = await program.account.requestAccount.fetch(request.publicKey);
      console.log('account: ', account);
      setImage('');
      setCategories('');
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  if (!wallet.connected) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div className="App">
        <div>
          <h4>Image String:</h4>
          <input
            placeholder="e.g. temp.jpg"
            onChange={e => setImage(e.target.value)}
            value={image}
          />
          <h4>Categories:</h4>
          <input
            placeholder="e.g. dog,cat,bird"
            onChange={e => setCategories(e.target.value)}
            value={categories}
          />
          <h4>Minimum Rating:</h4>
          <output>{min_rating}</output><p/>
          <input
            type="range"
            onChange={e => setMinRating(e.target.value)}
            value={min_rating}
            min="0"
            max="9"
          />
          <p/>
          <button onClick={initialize}>Send Request</button>
        </div>
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