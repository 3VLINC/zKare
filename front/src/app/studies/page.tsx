"use client";
import { useState } from "react";
import {  useAccount, useContractRead, useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { transactions } from "../../../../broadcast/ZKare.s.sol/420/run-latest.json";
import { abi as ZKareABI } from "../../../../abi/ZKare.json";
import { errorsABI } from "@/utils/misc";
import { useQuery, gql } from '@apollo/client';
import { useEas } from "@/shared/Eas";
import { SchemaEncoder,  } from "@ethereum-attestation-service/eas-sdk";
import { useConfig } from "@/shared/Config";

export default function Test() {
    const [studyName, setStudyName] = useState<string>("");
    const { chain } = useNetwork();
    const { eas, offchain, signer } = useEas();
    const { address } = useAccount();
    const { eas: { schemas: { doctor }}} = useConfig();
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
    const createStudy = async () => {
        if (address) {

            const schemaEncoder = new SchemaEncoder("string name");
            const encodedData = schemaEncoder.encodeData([
            { name: "Patient", value: "", type: "address" },
            { name: "Age", value: "", type: "bytes32" },
            { name: "Gender", value: "", type: "string" },
            { name: "Disease", value: "", type: "string" },
            { name: "Medications", value: "", type: "string" },
            { name: "Smoker", value: "", type: "bool" },

            ]);
            console.log('schema is', doctor);
            // offchain.signOffchainAttestation(
            //     {
            //         schema: doctor,
            //         recipient: "0x6dC9c87776c3dD7BC362c065f1f74fc9F89E52a4",
            //         revocable: true,
            //         data: encodedData,
            //         expirationTime: 0,
            //         // Unix timestamp of current time
            //         time: 1671219636,
            //         nonce: 0,
            //         version: 1,
            //         refUID: '0x0000000000000000000000000000000000000000000000000000000000000000'

            //     }, signer).then(
            //         console.log
            //     )
            console.log('schema id', doctor);
            const tx = await eas.attest(
                {
                    schema: doctor,
                    data: {
                        recipient: "0x6dC9c87776c3dD7BC362c065f1f74fc9F89E52a4",
                        revocable: true,
                        data: encodedData
                    }
                }
            ).then(
                (tx) => tx.wait()
            ).then(
                (id) => console.log('attestation id', id)
            ).catch(
                console.error
            );
        }
    }

    const handleStudyNameChange = (e: any) => {

        setStudyName(e.target.value);
        
    }

    return <div>
        <input onChange={handleStudyNameChange} value={studyName} />
        <button onClick={createStudy}>Create Study</button>
    </div>
}