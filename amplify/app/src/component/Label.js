import React from "react";
import './Label.css';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import idl from '../idl.json';

const { SystemProgram } = web3;
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function Label(props) {
  const [task, setTask] = React.useState(undefined);

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
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    
    const accounts = await provider.connection.getProgramAccounts(
      programID,
      {
        filters: [
          { dataSize: 10000 },                    // filters for request accounts
          { memcmp: { bytes: "1", offset: 44 } }, // filters for unlabelled images
        ],
        dataSlice: {length: 0, offset: 0}
      });

    for (const a of accounts) {
      const account = await program.account.requestAccount.fetch(a.pubkey);
      setTask({pubkey: a.pubkey, account: account})
      return;
    }

    // Else no tasks to label
    setTask(undefined);
  }

  async function label(category) {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    try {
      await program.rpc.label(
        category,
        {
          accounts: {
            request: task.pubkey,
            systemProgram: SystemProgram.programId,
          }
        }
      );

      const account = await program.account.requestAccount.fetch(task.pubkey);
      console.log('account: ', account);
      query();

    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  React.useEffect(() => { query(); }, []);

  return (
    <div className="Label">
      <h2>Label Data</h2>
      <img
        src={task ? task.account.image : ''}
        alt=''
        onError={e => e.target.src = 'https://static.thenounproject.com/png/340719-200.png'}
        width="200px"
        height="200px"
      />
      <p/>
      {task && task.account.labelSchema.split(',').map(
        e => (
          <button key={e} onClick={e => label(e.target.innerHTML)}>{e}</button>
        )
      )}
    </div>
  );
}

export default Label;


