"use client";
import { useEffect, useState } from "react";
import {
  useAccount
} from "wagmi";
import { useQuery, gql } from "@apollo/client";
import { useEas } from "@/shared/Eas";
import { useConfig } from "@/shared/Config";
import { useParams } from 'next/navigation'
import { NextPageContext } from "next";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { isUndefined } from "util";

export default function Patient({  }: NextPageContext) {
  
  const params = useParams();
  const { eas } = useEas();
  const { address } = useAccount();
  const {
    eas: {
      schemas: { studyPatient, patientProfile },
    },
  } = useConfig();
  
  const { data: studyPatientData, refetch } = useQuery(
    gql`
      query MyStudyPatient($address: String!, $recipient: String!) {
        attestations(take: 1, where: { schemaId: { equals: $address }, recipient: { equals: $recipient } }) {
          id
          attester
          data
        }
      }
    `,
    {
      variables: {
        address: studyPatient.address,
        recipient: params.patientId,
      },
    }
  );

    const { data: patientProfileData } = useQuery(
    gql`
      query PatientProfile($address: String!, $recipient: String!) {
        attestations(
          take: 25
          where: { schemaId: { equals: $address }, recipient: { equals: $recipient } }
        ) {
          id
          attester
          data
        }
      }
    `,
    {
      variables: {
        address: patientProfile.address,
        recipient: params.patientId,
      },
    }
  );

  const patientProfileSchemaEncoder = new SchemaEncoder(patientProfile.schema);

  let initialValues = {
    gender: "female",
    isSmoker: false,
    isOverweight: false,
    bloodType: "A+",
    treatment: "",
  }

  const [gender, setGender] = useState(initialValues.gender);
  const [isSmoker, setIsSmoker] = useState(initialValues.isSmoker);
  const [isOverweight, setIsOverweight] = useState(initialValues.isOverweight);
  const [bloodType, setBloodType] = useState(initialValues.bloodType);
  const [treatment, setTreatment] = useState(initialValues.treatment);

  useEffect(() => {

    if (patientProfileData && patientProfileData.attestations[0]) {
      const profile = patientProfileSchemaEncoder.decodeData(patientProfileData.attestations[0].data);
      
      const _gender = profile.find(({ name }) => name === 'gender')?.value.value as string | undefined;
      const _isSmoker = profile.find(({ name }) => name === 'isSmoker')?.value.value as boolean | undefined;
      const _isOverweight = profile.find(({ name }) => name === 'isOverweight')?.value.value as boolean | undefined;
      const _bloodType = profile.find(({ name }) => name === 'bloodType')?.value.value as string | undefined;
      const _treatment = profile.find(({ name }) => name === 'treatment')?.value.value as string | undefined;
  
      if (_gender) {
        setGender(_gender);
      }
      if (_isSmoker) {
      setIsSmoker(_isSmoker);
      }
      if (_isOverweight) {
      setIsOverweight(_isOverweight);
      }
      if (_bloodType) {
      setBloodType(_bloodType);
      }
      if (_treatment) {
      setTreatment(_treatment);
      }

    }

  }, [patientProfileData]);

  console.log('treatment', treatment);
  const saveProfile = async () => {
    
    if (address) {
      console.log(gender, isSmoker, isOverweight, bloodType, treatment)
      const encodedData = patientProfileSchemaEncoder.encodeData([
        { name: "gender", value: gender, type: "string" },
        { name: "isSmoker", value: isSmoker, type: "bool" },
        { name: "isOverweight", value: isOverweight, type: "bool" },
        { name: "bloodType", value: bloodType, type: "string" },
        { name: "treatment", value: treatment, type: "string" },
      ]);

      await eas
        .attest({
          schema: patientProfile.address,
          data: {
            recipient: address,
            revocable: true,
            data: encodedData,
          },
        })
        .then((tx) => tx.wait())
        .then(() => {
          refetch();
        })
        .catch(console.error);
    }
  };

  const handleGenderChange = (e: any) => {
    setGender(e.target.value);
  };

  const handleIsSmokerToggle = (e: any) => {
    setIsSmoker(!isSmoker);
  };
  const handleIsOverweightToggle = (e: any) => {
    setIsOverweight(!isOverweight);
  };
  const handleBloodTypeChange = (e: any) => {
    setBloodType(e.target.value);
  };
  const handleTreatmentChange = (e: any) => {
    setTreatment(e.target.value);
  };

  const studyPatientSchemaEncoder = new SchemaEncoder(studyPatient.schema);

  if (studyPatientData && studyPatientData.attestations[0]) {

    const profile = studyPatientSchemaEncoder.decodeData(studyPatientData.attestations[0].data);
    const patientName = profile.find(({ name }) => name === 'patientName')?.value.value as string;

    return (<div>
      <h1 style={{ color: 'black'}}>{patientName} </h1>
      Treatment
      <input onChange={handleTreatmentChange} value={treatment} />
      Blood Type
      <input onChange={handleBloodTypeChange} value={bloodType} />
      Is Smoker
      <input type="checkbox" onChange={handleIsSmokerToggle} checked={isSmoker === true} />
      IsOverweight
      <input type="checkbox" onChange={handleIsOverweightToggle} checked={isOverweight === true} />
      Gender
      <select onChange={handleGenderChange} value={gender}>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="not-disclosed">Not Disclosed</option>
      </select>
      <button onClick={saveProfile}>Save Profile</button>
    </div>);
  } else {
    return null;
  }

}
