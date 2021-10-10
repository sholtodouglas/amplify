# amplify
Decentralised market for work

After initial testing localhost - we could immediately use devnet? 

To use devnet, print yourself some money 
'''
solana airdrop 1 <RECIPIENT_ACCOUNT_ADDRESS> --url https://api.devnet.solana.com
'''

I think we'll need to change the name/address or something. 
'''
solana program deploy dist/program/helloworld.so --url devnet
'''

# From scratch instructions

```bash
solana-keygen new -o /home/<YOURPATH>/.config/solana/id.json # make yourself a personal wallet
```

Get https://phantom.app/

Click add new, and add by pasting the private key which you can get by opening the above file (id.json) and pasting the contents.

Now for the app. 

```bash
cd amplify
npm install
anchor build
```

```bash
solana-keygen new -o target/deploy/amplify-keypair.json # If building from scratch we'll need to create a pubkey for the project- future lets save this?
solana address -k target/deploy/amplify-keypair.json # Get the address of the keypair
```
Copy that address into '/programs/src/lib.rs'

```rust
declare_id!("<keypair_address_goes_here>");
```

## Ensure network is correct

Set your default network in case you need to airdrop etc

```

solana config set --url localhost # or localhost or mainnet
```

In anchor.toml 
```
cluster = "localnet" # or localnet or mainnet
```

In 'Anchor.toml', set the wallet path to your personal keypair to sign off on the program with and replace the aplify addr with the one you're using for the app created.

```toml
amplify = "<keypair_address_goes_here>"
```





# Converting over to a given network e.g. devnet (localnet, devent, mainnetbeta)

## Ensure program address is correct in all instances
Get the address of the program
```
solana-keygen pubkey target/deploy/reality_db-keypair.json // HZhibWegBNoJbYNsXnTiYMs5HVvWf9k1ut6vMdFc6e1y
```

Copy this into anchor.toml
```
reality_db = "HZhibWegBNoJbYNsXnTiYMs5HVvWf9k1ut6vMdFc6e1y"
```

Copy this into lib.rs
```
declare_id!("HZhibWegBNoJbYNsXnTiYMs5HVvWf9k1ut6vMdFc6e1y");
```

Run a test validator (solana network) and deploy onto it
```bash
solana-test-validator

```


Build, deploy and ensure all idl.json files have the updated address
```
anchor build
anchor deploy

# take the file target/idl/reality_db.json and copy it into /solana/idl.json in each of frontend, backend, and sol_program/reality-db/app. Also ensure the index.ts is latest if you've made any changes. 
```


- Ensure they all point towards the correct network cntrl f 'network'
- Ensure ignoreSolana flag is set correctly cntr f 'ignoreSolana'

## Ensure network is correct

Set your default network in case you need to airdrop etc

```

solana config set --url localhost # or localhost or mainnet
```

In anchor.toml 
```
cluster = "localnet" # or localnet or mainnet
```

In each file where we reference network

// const network = "http://127.0.0.1:8899";
const network = clusterApiUrl("devnet");
const network = clusterApiUrl("mainnet");


Copy the contents of '/target/idl/amplify.json' into '/app/src/idl.json'
```bash
cd app
npm install
npm start
```

