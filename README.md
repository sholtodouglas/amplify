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

From scratch instructions

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

In 'Anchor.toml', set the wallet path to your personal keypair to sign off on the program with and replace the aplify addr with the one you're using for the app created.

```toml
amplify = "<keypair_address_goes_here>"
...
wallet = "/home/sholtodouglas/.config/solana/id.json"
...
```

Run a test validator (solana network) and deploy onto it
```bash
solana-test-validator
anchor build
anchor deploy
```

Copy the contents of '/target/idl/amplify.json' into '/app/src/idl.json'
```bash
cd app
npm install
npm start
```



