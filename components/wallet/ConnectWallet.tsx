"use client";

import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useChainId,
} from "wagmi";
import { formatUnits } from "viem";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, error } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
  });

  // Wallet connected
  if (isConnected) {
    return (
      <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
        {/* Wallet Address */}
        <div>
          <p className="text-sm text-gray-400">
            Wallet
          </p>

          <p className="mt-1 break-all font-mono text-sm text-white">
            {address}
          </p>
        </div>

        {/* Network */}
        <div>
          <p className="text-sm text-gray-400">
            Network
          </p>

          <p className="mt-1 text-white">
            Chain ID: {chainId}
          </p>
        </div>

        {/* ETH Balance */}
        <div>
          <p className="text-sm text-gray-400">
            ETH Balance
          </p>

          <p className="mt-1 text-xl font-semibold text-green-400">
            {isBalanceLoading
              ? "Loading..."
              : balance
                ? `${Number(
                    formatUnits(
                      balance.value,
                      balance.decimals
                    )
                  ).toFixed(4)} ${balance.symbol}`
                : "0.0000 ETH"}
          </p>
        </div>

        {/* Disconnect */}
        <button
          onClick={() => disconnect()}
          className="w-full rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Wallet not connected
  return (
    <div className="space-y-3">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Connect {connector.name}
        </button>
      ))}

      {/* Connection Error */}
      {error && (
        <p className="mt-3 break-words text-sm text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
}