"use client";
import { useState } from "react";
import {
  useAccount, useEnsResolver
} from "wagmi";
import { useQuery, gql } from "@apollo/client";
import { useEas } from "@/shared/Eas";
import { SchemaEncoder, ZERO_ADDRESS } from "@ethereum-attestation-service/eas-sdk";
import { useConfig } from "@/shared/Config";
import Link from "next/link";
import { useParams } from 'next/navigation'
import { NextPageContext } from "next";

export default function Study({  }: NextPageContext) {
  
  const params = useParams();
  const [doctorName, setDoctorName] = useState<string>("");
  const [doctorAddress, setDoctorAddress] = useState<string>("");
  const { eas } = useEas();
  const { address } = useAccount();
  const {
    eas: {
      schemas: { doctorStudy },
    },
  } = useConfig();
  
  const { data: datum, refetch } = useQuery(
    gql`
      query MyStudyDoctors($address: String!, $attester: String!) {
        attestations(take: 25, where: { schemaId: { equals: $address }, attester: { equals: $attester } }) {
          id
          attester
          data
        }
      }
    `,
    {
      variables: {
        address: doctorStudy.address,
        attester: address,
      },
    }
  );

  const schemaEncoder = new SchemaEncoder(doctorStudy.schema);

  const createStudy = async () => {
    if (address) {
      
      const encodedData = schemaEncoder.encodeData([
        { name: "doctorName", value: doctorName, type: 'string' },
        { name: "studyId", value: params.id || '', type: 'bytes32' },
      ]);

      await eas
        .attest({
          schema: doctorStudy.address,
          data: {
            recipient: doctorAddress || ZERO_ADDRESS,
            revocable: true,
            data: encodedData,
          },
        })
        .then((tx) => tx.wait())
        .then(() => {
            setDoctorName('');
            setDoctorAddress('');
            refetch();
        })
        .catch(console.error);
    }
  };

  const handleDoctorNameChange = (e: any) => {
    setDoctorName(e.target.value);
  };
  
  const handleDoctorAddressChange = (e: any) => {
    setDoctorAddress(e.target.value);
  };

  const doctors = (datum?.attestations || []).map((attestation: any) => {
      
    return {
      id: attestation.id,
      name: schemaEncoder.decodeData(attestation.data).find(
        ({ name }) => name === 'doctorName'
    )?.value.value,

      };

  });
  
  return (
    <div>
      <input onChange={handleDoctorNameChange} value={doctorName} />
      <input onChange={handleDoctorAddressChange} value={doctorAddress} />
      <button onClick={createStudy}>Create Doctor</button>
      <ul>
        {doctors.map((study: any) => <Link key={study.id} href={`/study/${study.id}`}><span style={{color:'white'}}>{study.name}</span></Link>)}
      </ul>
    </div>
  );
}
