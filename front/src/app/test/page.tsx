"use client";
import { useState } from "react";
import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { transactions } from "../../../../broadcast/Airdrop.s.sol/5151111/run-latest.json";
import { abi as AirdropABI } from "../../../../abi/Airdrop.json";
import { errorsABI } from "@/utils/misc";

export default function Test() {
    const [studyName, setStudyName] = useState<string>("");
    const { chain } = useNetwork();
    const contractCallInputs =
    studyName && chain
      ? {
          address: transactions[0].contractAddress as `0x${string}}`,
          abi: [...AirdropABI, ...errorsABI],
          functionName: "createStudy",
          args: [studyName],
          chain,
        }
      : {};
    const { config, error: wagmiSimulateError } = usePrepareContractWrite(contractCallInputs);
    const { writeAsync } = useContractWrite(config);

    const createStudy = () => {
        writeAsync?.();
    }

    const handleStudyNameChange = (e: any) => {

        setStudyName(e.target.value);
        
    }

    return <div>
        <input onChange={handleStudyNameChange} value={studyName} />
        <button onClick={createStudy}>Create Study</button>
    </div>
}