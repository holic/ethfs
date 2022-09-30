# Expects jq to be installed

source .env
source .env.goerli

forge script script/Deploy.s.sol -vvv \
  --chain-id $CHAIN_ID \
  --rpc-url $RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast

#  cat broadcast/Deploy.s.sol/5/run-latest.json | jq -r '.transactions | to_entries | [{key: .[].value.contractName, value: {deployedTo: .[].value.contractAddress, deployer: .[].value.transaction.from, transactionHash: ..|..}}] | from_entries'