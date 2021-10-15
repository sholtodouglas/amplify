import './Request.css';
import { useState } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import idl from '../idl.json';

const { SystemProgram, Keypair } = web3;
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function Request(props) {
  const [image, setImage] = useState('');
  const [label_schema, setLabelSchema] = useState('');
  const [min_rating, setMinRating] = useState(0);

  console.log(props)

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    // const network = "http://127.0.0.1:8899";
    const network = clusterApiUrl("devnet");
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new Provider(
      connection, props.wallet, opts.preflightCommitment,
    );
    return provider;
  }

  async function request() {    
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    const request = Keypair.generate();


    try {
      await program.rpc.request(
        image,        // URL string
        label_schema, // Stringified JSON
        Math.floor(parseFloat(min_rating) * 1e4) >>> 0,
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
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  return (
    <div className="Request">
      <h2>Request Label</h2>
      <img
        src={image}
        alt=''
        onError={e => e.target.src = 'https://static.thenounproject.com/png/340719-200.png'}
        width="200px"
        height="200px"
      />
      <h4>Image String:</h4>
      <input
        placeholder="e.g. tmp.jpg"
        onChange={e => setImage(e.target.value)}
        value={image}
      />
      <h4>Label Schema:</h4>
      <input
        placeholder=""
        onChange={e => setLabelSchema(e.target.value)}
        value={label_schema}
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
      <button onClick={request}>Send Request</button>
    </div>
  );
}

export default Request;