import React from "react";
import './Label.css';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import idl from '../idl.json';
import { useReducer} from "react";
import { LabellerSpace } from "./LabellerSpace";
import { set } from "@project-serum/anchor/dist/cjs/utils/features";

const { SystemProgram } = web3;
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

const testSchema = [
  {
    label: "Question",
    key: "question",
    type: "text",
  }
];

async function getProvider(wallet) {
  /* create the provider and return it to the caller */
  /* network set to local network for now */
  const network = "http://127.0.0.1:8899";
  const connection = new Connection(network, opts.preflightCommitment);

  const provider = new Provider(
    connection, wallet, opts.preflightCommitment,
  );
  return provider;
}

async function label(wallet, info, pubkey) {
  const provider = await getProvider(wallet);
  const program = new Program(idl, programID, provider);
  try {
    await program.rpc.label(
      info,
      {
        accounts: {
          request: pubkey,
          systemProgram: SystemProgram.programId,
        }
      }
    );

    const account = await program.account.requestAccount.fetch(pubkey);
    console.log('account: ', account);
  } catch (err) {
    console.log("Transaction error: ", err);
  }
}

async function query(wallet) {
  const provider = await getProvider(wallet);
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
    
    let r = {
      image: account.image,
      schema: testSchema,
      pubkey: a.pubkey
    }
    console.log('----',r)
    return r
  }
  return {
    image: "",
    schema: testSchema,
    pubkey: ""
  }
}


async function appReducer(state, action) {
  
  const { type, payload } = action;
  console.log('querying')
  let info = await query(payload['wallet'])
  
  switch (type){
    case "set":
      console.log('set', info)
      return Object.assign({}, state, {                 // <- NB the {}!
        image: info.image,
      })
    case "next":
      label(payload['wallet'], 'stuff', payload['pubkey'])
      console.log('next', info)
      return info
  }
}


function Label(props) {
  const [task, setTask] = React.useState({
    image: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
    schema: testSchema,
    pubkey: ""
  });

  // const [appState, appDispatch] = useReducer(appReducer, {
  //   image: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
  //   schema: testSchema,
  //   pubkey: ""
  // });

  async function label_and_update(wallet, info, pubkey) {
      label(wallet, info, pubkey)
      let response = await query(props.wallet)
      setTask(response)
  }
  


  React.useEffect(() => {
    async function fetchMyAPI() {
      
    }

    fetchMyAPI()
  }, [])
  // React.useEffect(() => { appDispatch({type:"set", payload: {'wallet': props.wallet}}) ; }, []);
  console.log('t', task)

  if (task.image == undefined) {
    console.log('undef', task)
    return <div>Undefined</div>
  } else {
    console.log('task', task)
  return (
    <div className="Label">
      <h2>Label Data</h2>

      <LabellerSpace
        schema={task.schema == testSchema ? task.schema : [] }
        src={task.image}
        update_fn={label_and_update}
        appDispatch={undefined}
        taskPubKey = {task ? task.pubkey : ''}
        wallet = {props.wallet}
      />
      <p/>
    </div>
  );
}
}

export default Label;

