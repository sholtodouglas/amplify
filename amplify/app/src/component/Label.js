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
  const [task, setTask] = React.useState(undefined)

  console.log(idl)
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
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, opts.preflightCommitment);
    
    const allLinkedAccounts = await connection.getProgramAccounts(
      programID,
      {
        filters: [
          {dataSize: 1000}
        ],
        dataSlice: {length: 0, offset: 0}
      });

    for (const acct of allLinkedAccounts) {
      const account = await program.account.requestAccount.fetch(acct.pubkey);
      //TODO all accounts should have a 'type' (labeller or request) so that we can filter

      if (account.label == null) { // TODO and my labeller rating > account.minRating
        // not yet labelled, therefore fill it out
        setTask({pubkey: acct.pubkey, account: account})
        return;
      }
    }

    // Else no tasks to label
    setTask(undefined)

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
      <button onClick={query}>Query</button>
      <img
        src={task ? task.account.image : ''}
        alt=''
        onError={e => e.target.src = 'https://static.thenounproject.com/png/340719-200.png'}
        width="200px"
        height="200px"
      />
      <p/>
      {task && task.account.categories.split(',').map(
        e => (
          <button key={e} onClick={e => label(e.target.innerHTML)}>{e}</button>
        )
      )}
    </div>
  );
}

export default Label;


