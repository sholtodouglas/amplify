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
  const [category, setCategory] = useState('');
  const [min_rating, setMinRating] = useState('');
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
        category,
        min_rating,
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
      setCategory('');
      setMinRating('');
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
          <input
            placeholder="Image string"
            onChange={e => setImage(e.target.value)}
            value={image}
          />
          <input
            placeholder="Class string"
            onChange={e => setCategory(e.target.value)}
            value={category}
          />
          <input
            placeholder="Minimum rating"
            onChange={e => setMinRating(e.target.value)}
            value={min_rating}
          />
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