# Amplify Python Client

Python client for programatic interaction with amplify on solnet

## Client Interface

```
async pull(requester_pubkey: str) -> List
```

Returns a list of dictionaries containing image url, label schema and labels of all requests made by the requester account.

**Parameters**
* requester_pubkey: Pubkey of requester account to query, as base-58 encoded string.

```
async push(secret_key: str, image: str, label_schema: str, min_rating: float)
```

Creates a label request account.

**Parameters**
* secret_key: Secret key of the requester account. The transaction and account initialisation payment is made using this account. The request account points to this account as its associated requester.
* image: Url of the image to be labelled
* label_schema: Stringified JSON object outlining the the labelling scheme for the image.
* min_rating: The minimum rating (0-10) a labeller must have to label the image.

##Usage

```
import asyncio

asyncio.run(
    py_client.pull("HZhibWegBNoJbYNsXnTiYMs5HVvWf9k1ut6vMdFc6e1y")
)
```

## Dependencies

```
solana==0.17.0
borsh-python==0.1.5
```
