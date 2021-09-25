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


Steps to run from git pull on 
0. change wallet address path from jlc/sholto to yours (we should make this an env variable) 
1. npm install
2. anchor build
3. Ensure you copy /src/idl/anchor.json to app/src/idl.json
4. anchor deploy
5. cd app
6. npm install



To debug address: 

solana address -k target/deploy/mysolanaapp-keypair.json - is this the same as your program one?


