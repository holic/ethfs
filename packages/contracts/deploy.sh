# Expects jq to be installed

source .env
source .env.goerli

forge script script/DeployFileStore.s.sol -vvv \
  --chain-id $CHAIN_ID \
  --rpc-url $RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast
