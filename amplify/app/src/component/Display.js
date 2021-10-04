import React from "react";
import './Display.css';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider } from '@project-serum/anchor';
import idl from '../idl.json';

const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function Display(props) {
  const [images, setImages] = React.useState([]);
  const [showUnlabelled, setShowUnlabelled] = React.useState(false);

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(
      connection, props.wallet, opts.preflightCommitment,
    );
    return provider;
  }

  async function query() {
    // Comms set up
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    
    const accounts = await provider.connection.getProgramAccounts(
      programID,
      {
        filters: [
          { dataSize: 1000 },
          { memcmp: {bytes: provider.wallet.publicKey.toBase58(), offset: 8} },
        ],
        dataSlice: {length: 0, offset: 0}
      });

    setImages([]);

    for (const acct of accounts) {
      const account = await program.account.requestAccount.fetch(acct.pubkey);
      if (account.label !== null || showUnlabelled) {
        setImages(images => [...images, account])
      }
    }
  }

  React.useEffect(() => { query(); }, []);

  return (
    <div className="Display">
      <h2>Display Labels</h2>
      <button onClick={() => { setShowUnlabelled(v => !v); query(); }}>Show {showUnlabelled ? "All" : "Labelled"} Images</button>
      <div className="displayBox">
        {images.map((e, i) => (
          <div className="displayImage" key={i}>
            <img
              src={e.image}
              alt=''
              onError={e => e.target.src = 'https://static.thenounproject.com/png/340719-200.png'}
              width="200px"
              height="200px"
            />
            <div className="displayCaption">{e.label ? e.label : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Display;


