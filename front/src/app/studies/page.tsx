"use client";
import { useState } from "react";
import {
  useAccount
} from "wagmi";
import { useQuery, gql } from "@apollo/client";
import { useEas } from "@/shared/Eas";
import { SchemaEncoder, ZERO_ADDRESS } from "@ethereum-attestation-service/eas-sdk";
import { useConfig } from "@/shared/Config";
import Link from "next/link";
export default function Test() {

  const [studyName, setStudyName] = useState<string>("");
  const { eas } = useEas();
  const { address } = useAccount();
  const {
    eas: {
      schemas: { study },
    },
  } = useConfig();

  const { data: datum, refetch } = useQuery(
    gql`
      query MyStudies($address: String!, $attester: String!) {
        attestations(take: 25, where: { schemaId: { equals: $address }, attester: { equals: $attester } }) {
          id
          attester
          data
        }
      }
    `,
    {
      variables: {
        address: study.address,
        attester: address,
      },
    }
  );

  const schemaEncoder = new SchemaEncoder(study.schema);

  const createStudy = async () => {
    if (address) {
      
      const encodedData = schemaEncoder.encodeData([
        { name: "study", value: studyName, type: 'string' },
      ]);

      await eas
        .attest({
          schema: study.schema,
          data: {
            recipient: ZERO_ADDRESS,
            revocable: true,
            data: encodedData,
          },
        })
        .then((tx) => tx.wait())
        .then(() => {
            setStudyName('');
            refetch();
        })
        .catch(console.error);
    }
  };

  const handleStudyNameChange = (e: any) => {
    setStudyName(e.target.value);
  };

  const studies = (datum?.attestations || []).map((attestation: any) => {
    const decodedData = schemaEncoder.decodeData(attestation.data);
    return {
      id: attestation.id,
      value: decodedData.find(
        ({ name }) => name === 'study'
    )?.value.value
      };

  });

  return (
    <div>
      <input onChange={handleStudyNameChange} value={studyName} />
      <button onClick={createStudy}>Create Study</button>
      <ul>
        {studies.map((study: any) => <Link key={study.id} href={`/study/${study.id}`}><span style={{color:'white'}}>{study.value}</span></Link>)}
      </ul>
    </div>
  );
}
