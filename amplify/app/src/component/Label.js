import './Label.css';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import idl from '../idl.json';

const { SystemProgram, Keypair } = web3;
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function Label(props) {
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

  async function label(category) {    
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);

    // TODO: query the blockchain for this data
    const lastRequest = props.lastRequest;

    try {
      await program.rpc.label(
        category,
        {
          accounts: {
            request: lastRequest.publicKey,
            systemProgram: SystemProgram.programId,
          }
        }
      );

      const account = await program.account.requestAccount.fetch(lastRequest.publicKey);
      console.log('account: ', account);
      props.callback(undefined);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }


  async function log_accounts() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, opts.preflightCommitment);
    
    const tokenAcctObjects = await connection.getParsedProgramAccounts(programID);

    for (const acct of tokenAcctObjects) {
        const account = await program.account.requestAccount.fetch(acct.pubkey);
        console.log('log: ', account);
  }
}




  const categories = props.lastRequest ? (
    props.lastRequest.account.categories.split(',').map(
      e => (
        <button key={e} onClick={e => label(e.target.innerHTML)}>{e}</button>
      )
    )
  ) : [];

  return (
    <div className="Label">
      <button onClick={log_accounts}>Log accounts</button>
      <h2>Label Data</h2>
      <img
        src={props.lastRequest ? props.lastRequest.account.image : ''}
        alt=''
        onError={e => e.target.src = 'https://static.thenounproject.com/png/340719-200.png'}
        width="200px"
        height="200px"
      />
      <p/>
      {categories}
    </div>
  );
}

export default Label;


