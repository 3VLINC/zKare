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
import { useParams } from 'next/navigation'
import { NextPageContext } from "next";

export default function Patient({  }: NextPageContext) {
  
  const params = useParams();
  const [patientName, setPatientName] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const { eas } = useEas();
  const { address } = useAccount();
  const {
    eas: {
      schemas: { studyPatient },
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
        address: studyPatient.address,
        recipient: address,
      },
    }
  );

  const schemaEncoder = new SchemaEncoder(studyPatient.schema);

  const createPatient = async () => {
    if (address) {
      
      const encodedData = schemaEncoder.encodeData([
        { name: "patientName", value: patientName, type: 'string' },
        { name: "studyId", value: params.id, type: 'bytes32' },
      ]);

      await eas
        .attest({
          schema: studyPatient.schema,
          data: {
            recipient: ZERO_ADDRESS,
            revocable: true,
            data: encodedData,
          },
        })
        .then((tx) => tx.wait())
        .then(() => {
            setPatientName('');
            setPatientAddress('');
            refetch();
        })
        .catch(console.error);
    }
  };

  const handlePatientNameChange = (e: any) => {
    setPatientName(e.target.value);
  };
  
  const handlePatientAddressChange = (e: any) => {
    setPatientAddress(e.target.value);
  };

  const patients = (datum?.attestations || []).map((attestation: any) => {
    return {
      id: attestation.id,
      value: schemaEncoder.decodeData(attestation.data).find(
        ({ name }) => name === 'study'
    )?.value.value
      };

  });
  
  return (
    <div>
      <input onChange={handlePatientNameChange} value={patientName} />
      <input onChange={handlePatientAddressChange} value={patientAddress} />
      <button onClick={createPatient}>Create Patient</button>
      <ul>
        {patients.map((study: any) => <Link key={study.id} href={`/doctor/patient/${study.id}`}><span style={{color:'white'}}>{study.value}</span></Link>)}
      </ul>
    </div>
  );
}
