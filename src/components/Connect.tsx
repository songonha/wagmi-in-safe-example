import {
  useAccount,
  useConnect,
  useDisconnect,
  useEstimateGas,
  useSendTransaction,
  useSimulateContract,
  useWriteContract,
} from 'wagmi';

import { useAutoConnect } from '../useAutoConnect';

export function Connect() {
  const { connect, connectors, error } = useConnect();
  const { isConnecting, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: txGasEstimate } = useEstimateGas({
    to: '0xe4d2ba7619c7ee526241cf1c229679780f70a3b2',
    value: BigInt('0'),
  });

  const { sendTransactionAsync } = useSendTransaction();

  const { data } = useSimulateContract({
    // wagmi mint example contract
    address: '0xe4d2ba7619c7ee526241cf1c229679780f70a3b2', //base sepolia
    abi: [
      {
        name: 'mint',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [],
        outputs: [],
      },
    ],
    functionName: 'mint',
  });

  const { writeContract } = useWriteContract();

  useAutoConnect();

  return (
    <div>
      <div>
        {activeConnector && (
          <>
            <button onClick={() => disconnect()}>Disconnect from {activeConnector.name}</button>
            <button onClick={() => writeContract(data!.request)}>
              Test WagmiMintExample write contract transaction
            </button>
            <button
              onClick={() =>
                sendTransactionAsync?.({
                  gas: txGasEstimate,
                  to: '0xe4d2ba7619c7ee526241cf1c229679780f70a3b2',
                  value: BigInt('0'),
                })
              }
            >
              Test send transaction
            </button>
          </>
        )}

        {connectors
          .filter((x) => x.id !== activeConnector?.id)
          .map((x) => (
            <button key={x.id} onClick={() => connect({ connector: x })}>
              {x.name}
              {isConnecting && ' (connecting)'}
            </button>
          ))}
      </div>

      {error && <div>{error.message}</div>}
    </div>
  );
}
