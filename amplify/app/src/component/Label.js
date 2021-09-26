
import React from "react";
import './Label.css';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import idl from '../idl.json';
import { set } from "@project-serum/anchor/dist/cjs/utils/features";

const { SystemProgram, Keypair } = web3;
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function Label(props) {

  // Convert the list in the idl that has the different kind of accounts to a dict
  let account_types = Object.assign({}, ...idl.accounts.map((x) => ({[x.name]: x.type})));
  
  // set a state variable task with as a dict with the correct fields to be updared (as a request account signifies a task)
  let requestAccount = Object.assign({}, ...account_types.RequestAccount.fields.map((x) => ({[x.name]: x.type})));
  const [task, setTask] = React.useState(requestAccount)

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
    
    const allLinkedAccounts = await connection.getParsedProgramAccounts(programID);

    for (const acct of allLinkedAccounts) {
        const account = await program.account.requestAccount.fetch(acct.pubkey);
        //TODO all accounts should have a 'type' (labeller or request) so that we can filter

        if (account.label == null) { // TODO and my labeller rating > account.minRating
          // not yet labelled, therefore fill it out
          setTask({"publicKey": acct.pubkey, "image": account.image, "label":account.label, "categories": account.categories})
          return;
        } 
        console.log('log: ', account);
  }

  // Else no tasks to label
  setTask({"publicKey": null, "image": null, "label":null, "categories":""})

}

  async function label(category) { 
    
    console.log("task", task)
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    try {
      await program.rpc.label(
        category,
        {
          accounts: {
            request: task.publicKey,
            systemProgram: SystemProgram.programId,
          }
        }
      );

      const account = await program.account.requestAccount.fetch(task.publicKey);
      console.log('account: ', account);
      props.callback(undefined);

      // query for another task
      query();

    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  // Similar to componentDidMount and componentDidUpdate:
  React.useEffect(() => {
    // Update the document title using the browser API
    query();
  }, []);

  return (
    <div className="Label">
      <button onClick={query}>Query</button>
      <h2>Label Data</h2>
      <img
        src={props.lastRequest ? props.lastRequest.account.image : ''}
        alt=''
        onError={e => e.target.src = 'https://static.thenounproject.com/png/340719-200.png'}
        width="200px"
        height="200px"
      />
      <p/>
      {task.categories.split(',').map(
      e => (
        <button key={e} onClick={e => label(e.target.innerHTML)}>{e}</button>
      )
    )}
    </div>
    
  );
}

export default Label;


