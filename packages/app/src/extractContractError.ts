import {
  ContentStore__factory,
  FileStore__factory,
} from "@ethfs/contracts/types";

const contractInterfaces = {
  FileStore: FileStore__factory.createInterface(),
  ContentStore: ContentStore__factory.createInterface(),
};

const contractErrors = Object.entries(contractInterfaces).flatMap(
  ([contractName, contractInterface]) =>
    Object.values(contractInterface.errors).map((errorFragment) => ({
      name: `${contractName}.${errorFragment.name}`,
      signature: contractInterface.getSighash(errorFragment),
      fragment: errorFragment,
    }))
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractContractError = (error: any): string => {
  // console.dir(error);

  // Attempt to extract Solidity error
  const errorData = error.error?.data?.originalError?.data;
  if (typeof errorData === "string") {
    console.log("found error data in original error, write call?", errorData);
    const contractError = contractErrors.find((e) =>
      errorData.startsWith(e.signature)
    );
    if (contractError) {
      // const args = contractInterface.decodeErrorResult(contractError.fragment, errorData)
      return `Contract call reverted: ${contractError.name}`;
    }
  }

  // Read calls will revert differently
  try {
    const response = JSON.parse(error.error.response);
    const errorData = response.error.data;
    console.log("found error data in error response, read call?", errorData);
    if (typeof errorData === "string") {
      const contractError = contractErrors.find((e) =>
        errorData.startsWith(e.signature)
      );
      if (contractError) {
        // const args = contractInterface.decodeErrorResult(contractError.fragment, errorData)
        return `Contract call reverted: ${contractError.name}`;
      }
    }
  } catch (error) {
    // do nothing with the parse error so we can continue on
  }

  // Otherwise return error reason
  if (typeof error.reason === "string") {
    return error.reason;
  }
  // Fall back to error message
  return error.message;
};
