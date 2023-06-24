"use client";
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { useConfig } from "./Config";
import { PublicClient, WalletClient, usePublicClient, useWalletClient } from "wagmi";
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from "react";
import { providers } from 'ethers'
import { HttpTransport } from "viem";
 
export function publicClientToProvider(publicClient: PublicClient) {
    const { chain, transport } = publicClient
    const network = {
      chainId: chain.id,
      name: chain.name
      
    }
    if (transport.type === 'fallback')
      return new providers.FallbackProvider(
        (transport.transports as ReturnType<HttpTransport>[]).map(
          ({ value }) => new providers.JsonRpcProvider(value?.url, network),
        ),
      )
    return new providers.JsonRpcProvider(transport.url, network)
  }
   
  /** Hook to convert a viem Public Client to an ethers.js Provider. */
  export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
    const publicClient = usePublicClient({ chainId })
    return useMemo(() => publicClientToProvider(publicClient), [publicClient])
  }
  
export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
  }
  const provider = new providers.Web3Provider(transport as any, network)
  const signer = provider.getSigner(account.address)
  return signer
}
 
/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId })
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient],
  )
}

const EasContext = createContext<{ eas: EAS }>({
    eas: null as any
});

export const Eas = ({ children }: PropsWithChildren) => {
    const { eas: { contractAddress } } = useConfig();
    const [instance, setInstance] = useState<EAS | null>(null);
    const provider = useEthersProvider();
    
    const signer = useEthersSigner();
    
    useEffect(() => {
        if (signer && provider) {
            const eas = new EAS("0x234dee4d3e6a625b4121e2042d6267058755e53a2ecc55555da51a1e6f06cc58", {
                signerOrProvider: provider,
            });
            setInstance(eas.connect(signer));
        }
    }, [signer, provider]);

    if (!instance) {
        return null;
    }

    return (<EasContext.Provider value={{eas: instance}}>
        {children}
    </EasContext.Provider>);

}

