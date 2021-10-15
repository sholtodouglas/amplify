from solana.rpc.async_api import AsyncClient
import solana.rpc.types as types
from solana.transaction import Transaction, TransactionInstruction, AccountMeta
from solana.publickey import PublicKey
from solana.keypair import Keypair

import borsh
import base64
import base58
import asyncio

PROGRAM_ID = PublicKey("2FStxUMjeoPugj3oEYkmqyDMB9UyShhe1uBzHWTFpLdA")
REQUEST_ACCOUNT_SIZE = 10000
REQUEST_ACCOUNT_SCHEMA = borsh.schema({
    'mem_loc': borsh.types.fixed_array(borsh.types.u8, 8),
    'wallet_pubkey': borsh.types.fixed_array(borsh.types.u8, 32),
    'min_rating': borsh.types.u32,
    'label': borsh.types.option(borsh.types.string),
    'image': borsh.types.string,
    'label_schema': borsh.types.string,
})
REQUEST_SCHEMA = borsh.schema({
    'idx': borsh.types.u8,
    'image': borsh.types.string,
    'label_schema': borsh.types.string,
    'min_rating': borsh.types.u32
})

async def pull(requester_pubkey: str):
    async with AsyncClient("http://localhost:8899") as client:
        res = await client.get_program_accounts(
            PROGRAM_ID,
            "processed",
            "base64",
            data_size=REQUEST_ACCOUNT_SIZE,
            memcmp_opts=[types.MemcmpOpts(bytes=requester_pubkey, offset=8)])

    accounts = res['result']
    deserialised_accounts = []
    for account in accounts:
        data = account['account']['data'][0]
        decoded = base64.b64decode(data)
        deserialised = borsh.deserialize(REQUEST_ACCOUNT_SCHEMA, decoded)
        deserialised_accounts.append({
            "image": deserialised['image'],
            "label": deserialised['label'],
            'label_schema': deserialised['label_schema']
        })
    print(f"Found {len(deserialised_accounts)} accounts.")
    return deserialised_accounts

async def push(secret_key: str, image: str, label_schema: str, min_rating: float):
    secret_bytes = base58.b58decode(secret_key)
    requester = Keypair.from_secret_key(secret_bytes)
    request = Keypair.generate().public_key

    async with AsyncClient("http://localhost:8899") as client:
        blockhash = await client.get_recent_blockhash()
    keys = [
        AccountMeta(request, False, True),             # request
        AccountMeta(requester.public_key, True, True), # requester
        AccountMeta(PROGRAM_ID, False, False),         # program
    ]
    serialised = borsh.serialize(REQUEST_SCHEMA, {
        'idx': 2,
        'image': image,
        'label_schema': label_schema,
        'min_rating': int(min_rating * 1e4)
    })

    tx = Transaction()
    tx.add(TransactionInstruction(keys=keys, program_id=PROGRAM_ID, data=serialised))
    tx.recent_blockhash = blockhash['result']['value']['blockhash']
    tx.sign(requester)

    async with AsyncClient("http://localhost:8899") as client:
        res = await client.send_transaction(tx, requester)
    print(res)


if __name__ == '__main__':
    asyncio.run(pull("<wallet_public_key>"))
    asyncio.run(push(
        "<wallet_secret_key>",
        "https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313__340.jpg",
        "the_label_schema",
        4
    ))