"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useQuery, gql } from "@apollo/client";
import { useEas } from "@/shared/Eas";
import { useConfig } from "@/shared/Config";
import { useParams } from "next/navigation";
import { NextPageContext } from "next";

export default function PatientProfile({}: NextPageContext) {
  const params = useParams();
  const [gender, setGender] = useState("female");
  const [isSmoker, setIsSmoker] = useState(false);
  const [isOverweight, setIsOverweight] = useState(false);
  const [bloodType, setBloodType] = useState("A+");
  const [treatment, setTreatment] = useState("");
  const { eas } = useEas();
  const { address } = useAccount();
  const {
    eas: {
      schemas: { patientProfile, studyPatient  },
    },
  } = useConfig();

  const { data: patientRootData } = useQuery(
    gql`
    query PatientRoot($address: String!, $recipient: String!) {
        attestations(take: 25, where: { schemaId: { equals: $address }, recipient: { equals: $recipient } }) {
            id
            attester
            data
        }
    }`,
    {
        variables: {
            address: studyPatient.address
        }
    }
  );

//   const { data: datum, refetch } = useQuery(
//     gql`
//       query PatientProfile($address: String!, $recipient: String!) {
//         attestations(
//           take: 25
//           where: { schemaId: { equals: $address }, recipient: { equals: $recipient } }
//         ) {
//           id
//           attester
//           data
//         }
//       }
//     `,
//     {
//       variables: {
//         address: patientProfile.address,
//         recipient: params.patientId,
//       },
//     }
//   );

//   const schemaEncoder = new SchemaEncoder(patientProfile.schema);

//   const saveProfile = async () => {
    
//     if (address) {

//       const encodedData = schemaEncoder.encodeData([
//         { name: "gender", value: gender, type: "string" },
//         { name: "isSmoker", value: isSmoker, type: "bool" },
//         { name: "isOverweight", value: isOverweight, type: "bool" },
//         { name: "bloodType", value: bloodType, type: "string" },
//         { name: "treatment", value: treatment, type: "string" },
//       ]);

//       await eas
//         .attest({
//           schema: patientProfile.schema,
//           data: {
//             recipient: address,
//             revocable: true,
//             data: encodedData,
//           },
//         })
//         .then((tx) => tx.wait())
//         .then(() => {
//           setGender("");
//           setIsSmoker(false);
//           setIsOverweight(false);
//           setBloodType("");
//           setTreatment("");
//           refetch();
//         })
//         .catch(console.error);
//     }
//   };

//   const handleGenderChange = (e: any) => {
//     setGender(e.target.value);
//   };

//   const handleIsSmokerToggle = (e: any) => {
//     setIsSmoker(!isSmoker);
//   };
//   const handleIsOverweightToggle = (e: any) => {
//     setIsOverweight(!isOverweight);
//   };
//   const handleBloodTypeChange = (e: any) => {
//     setBloodType(e.target.value);
//   };
//   const handleTreatmentChange = (e: any) => {
//     setTreatment(e.target.value);
//   };

  return (
    <div>
      {/* <input onChange={handleTreatmentChange} value={treatment} />
      <input onChange={handleBloodTypeChange} value={bloodType} />
      <input type="checkbox" onChange={handleIsSmokerToggle} checked={isSmoker === true} />
      <input type="checkbox" onChange={handleIsOverweightToggle} checked={isOverweight === true} />
      <select onChange={handleGenderChange} value={gender}>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="not-disclosed">Not Disclosed</option>
      </select>
      <button onClick={saveProfile}>Save Profile</button> */}
    </div>
  );
}
