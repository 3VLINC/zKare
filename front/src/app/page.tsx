import { mumbaiFork } from "@/utils/wagmi";
import {
  SismoConnectButton, // the Sismo Connect React button displayed below
  SismoConnectConfig, // the Sismo Connect config with your appId
  AuthType, // the authType enum, we will choose 'VAULT' in this tutorial
  ClaimType, // the claimType enum, we will choose 'GTE' in this tutorial, to check that the user has a value greater than a given threshold
} from "@sismo-core/sismo-connect-react";
import { Auth } from "../shared/Auth";
import Link from "next/link";

const sismoConnectConfig: SismoConnectConfig = {
  appId: "0x173cf2e3342bc071b8a96f96f195b118",
  vault: {
    // For development purposes
    // insert any account that you want to impersonate  here
    // Never use this in production
    impersonate: ["researcher.eth"],
  },
};

const CHAIN = mumbaiFork;

export default function App() {
  return <Auth>
    <p>Test Helpers</p>
    <Link href="/pages/test.tsx">Test</Link>
  </Auth>;
}