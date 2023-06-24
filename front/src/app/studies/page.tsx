"use client";
import { useState } from "react";
import { useContractRead, useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { transactions } from "../../../../broadcast/ZKare.s.sol/5151111/run-latest.json";
import { abi as ZKareABI } from "../../../../abi/ZKare.json";
import { errorsABI } from "@/utils/misc";
import { useQuery, gql } from '@apollo/client';

export default function Test() {
    const [studyName, setStudyName] = useState<string>("");
    const { chain } = useNetwork();
    const { data: datum } = useQuery(gql`
        query MyDoctors {
            attestations(take: 25, where: { schemaId: { equals: "0x234dee4d3e6a625b4121e2042d6267058755e53a2ecc55555da51a1e6f06cc58"}}) {
                id
                attester
                data
            }
            }
`, {

});

    console.log('datum', datum)
    const contractCallInputs =
    studyName && chain
      ? {
          address: transactions[0].contractAddress as `0x${string}}`,
          abi: [...ZKareABI, ...errorsABI],
          functionName: "createStudy",
          args: [studyName],
          chain,
        }
      : {};
    const { config: writeConfig, error: wagmiSimulateError } = usePrepareContractWrite(contractCallInputs);
    
    const { writeAsync } = useContractWrite(writeConfig);

    const { data, error } = useContractRead({
        abi: [...ZKareABI],
        address: transactions[0].contractAddress as `0x${string}}`,
        functionName: 'studyCounter'
    });

    // console.log('number of studies', (data as BigInt).toString() , error);
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