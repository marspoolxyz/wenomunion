import { Address, getRandomNonce, toNano } from "locklift";

async function main() {
  const json = {
    "type": "SportyBeaver NFT",
    "name": "SportyBeaver in Venom",
    "description": "Sporty Beaver is an extremely cute NFT character of Sporty Beavers Move-2-Earn game. Owning Sporty Beaver can give opportunity to play AR-games and compete with other beavers.",
    "preview": {
      "source": "https://cloudflare-ipfs.com/ipfs/QmR3Yxa8eQ9zE4vEk9L3bLWDkFBzCnJoCgmRynLtbPMHoV/1.png",
      "mimetype": "image/png"
    },
    "files": [
      {
        "source": "https://cloudflare-ipfs.com/ipfs/QmR3Yxa8eQ9zE4vEk9L3bLWDkFBzCnJoCgmRynLtbPMHoV/1.png",
        "mimetype": "image/jpg"
      }
    ],
    "external_url": "https://venom.network"
  };
  const signer = (await locklift.keystore.getSigner("0"))!;
  //const contract = locklift.getDeployedContract();

  const nft = locklift.factory.getContractArtifacts("Nft");
  const index = locklift.factory.getContractArtifacts("Index");
  const indexBasis = locklift.factory.getContractArtifacts("IndexBasis");
  const { contract: SportsBeavers, tx } = await locklift.factory.deployContract({
    contract: "SportsBeavers",
    publicKey: signer.publicKey,
    initParams: {
      nonce: getRandomNonce(),
      owner: `0x${signer.publicKey}`,
    },
    constructorParams: {
      _state: 0, // Below is the INR Contract
      supply: 10000000000000000, // Token Supply
      rate: 1000000000, // Cost of Token

      root_: new Address("0:65c3ff8fdd39c2487a9b0536c785ef8d528b1a6e8cefa9c2d03ddb1981255b6b"), // Token address
      json: JSON.stringify(json),
      codeNft: nft.code,
      codeIndex: index.code,
      codeIndexBasis: indexBasis.code
    },
    value: locklift.utils.toNano(5),
  });
  console.log(`SportsBeavers deployed at: ${SportsBeavers.address.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
