"use client";
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { errorsABI, formatError, fundMyAccountOnLocalFork, signMessage } from "@/utils/misc";
import { PropsWithChildren, useEffect, useState } from "react";
import { mumbaiFork } from "@/utils/wagmi";
import { SismoConnectConfig } from "@sismo-core/sismo-connect-react";

const CHAIN = mumbaiFork;

export const Auth = ({ children }: PropsWithChildren) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount({
    onConnect: async ({ address }) => address && (await fundMyAccountOnLocalFork(address)),
  });
  const [found, setFound] = useState<boolean>(false);
  const { switchNetworkAsync, switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (chain?.id !== CHAIN.id) return setError(`Please switch to ${CHAIN.name} network`);
    setError("");
  }, [chain]);
  
  if (!isConnected) {
    return (
    <>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready || isLoading}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {isLoading && pendingConnector?.id === connector.id
            ? "Connecting..."
            : "Connect"}
        </button>
      ))}
    </>
  )} else {

    return <>{children}
    <button onClick={() => disconnect()}>Disconnect</button></>;

  } 

}