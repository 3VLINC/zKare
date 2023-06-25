"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useQuery, gql } from "@apollo/client";
import { useEas } from "@/shared/Eas";
import { SchemaEncoder, ZERO_ADDRESS } from "@ethereum-attestation-service/eas-sdk";
import { useConfig } from "@/shared/Config";
import Link from "next/link";
import { useEffect } from "react";
import 'bulma/css/bulma.min.css';
import Banner from "../components/banner"
import ModalButton from "../components/modalButton"
import CreatePatient from "../components/createPatient"
export default function Doctor() {
  const { address } = useAccount();
  const {
    eas: {
      schemas: { doctorStudy, study },
    },
  } = useConfig();
  const [studyAttesters, setStudyAttesters] = useState<string[]>([]);
  const { data: datum } = useQuery(
    gql`
      query MyStudies($address: String!, $recipient: String!) {
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
        address: doctorStudy.address,
        recipient: address,
      },
    }
  );

  useEffect(() => {
    const schemaEncoder = new SchemaEncoder(doctorStudy.schema);

    const studies: any[] = (datum?.attestations || []).map((attestation: any) => {
      const decodedData = schemaEncoder.decodeData(attestation.data);
      return {
        id: attestation.id,
        value: decodedData.find(({ name }) => name === "studyId")?.value.value,
        attester: attestation.attester,
      };
    });

    const studyAttesters = studies.map((_study) => _study.attester);

    setStudyAttesters(studyAttesters);
  }, [datum]);
  
  const { data: datum2 } = useQuery(
    gql`
      query Studies($address: String!, $attesters: [String!]) {
        attestations(
          take: 25
          where: { schemaId: { equals: $address }, attester: { in: $attesters } }
        ) {
          id
          attester
          data
        }
      }
    `,
    {
      variables: {
        address: doctorStudy.address,
        attesters: studyAttesters,
      },
    }
  );

  const schemaEncoder = new SchemaEncoder(study.schema);

  const studies = (datum2?.attestations || []).map((attestation: any) => {
    const decodedData = schemaEncoder.decodeData(attestation.data);
    console.log(decodedData);
    return {
      id: attestation.id,
      value: decodedData.find(
        ({ name }) => name === 'study'
    )?.value.value
      };

  });

  const patients = [
    {
        name: "John Doe",
        updated: "12-03-2018",
        dob: "06-10-2002",
        gender: "Male",
        smoker: "True",
        records: [
            {
                updated: "12-03-2018",
                heartRate: "56"
            },
            {
                updated: "01-03-2019",
                heartRate: "60"
            }
        ]
    },
    {
        name: "Jane Doe",
        updated: "12-03-2018",
        dob: "06-10-2002",
        gender: "Female",
        smoker: "False",
        records: [
            {
                updated: "12-03-2018",
                heartRate: "56"
            },
            {
                updated: "01-03-2019",
                heartRate: "60"
            }
        ]
    }
]

const [filter, setFilter] = useState('');
const [data, setData] = useState(patients); // Replace `[...]` with your data array

const filteredData = data.filter((item) =>
  item.name.toLowerCase().includes(filter.toLowerCase())
);
  console.log(studies);

  const back = {
    backgroundColor: "#ffffff",
    fontColor: "#000000",
    height: "100%",
    padding: "20px",
  };

  const block = {
    padding: "40px",
    marginLeft: "120px"
  }

  return (
    <div style={back}>
        <Banner></Banner>
    
    <div style={block}>
      <div className="columns">
        <div className="column">
        <h1 className="title has-text-centered">Patients</h1>
        {filteredData.map((patient: any) => (
                <div className="card">
                <div className="card-content">
                    <div className="content">
                        <div className="columns">
                            <div className="column">
                                <h2>{patient.name}</h2>
                                <h3>Last updated: {patient.updated}</h3>
                            </div>
                            <div className="column">
                                <div className="buttons is-right">
                                    <ModalButton patient={patient}></ModalButton>
                                    <div className="button is-danger">
                                        Delete
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                </div>
            </div>
        ))}
        </div>
        <div className="column">
        <h1 className="title has-text-centered"></h1>
            <div className="field">
                <div className="control">
                    <input className="input" value={filter} onChange={(e) => setFilter(e.target.value)} type="text" placeholder="Search Patients"/>
                </div>
            </div>
            <div className="buttons is-centered">
                <CreatePatient patients={patients}></CreatePatient>
            </div>
        </div>
    </div>
      <ul>
        {studies.map((study: any) => (
          <Link key={study.id} href={`/doctor/study/${study.id}`}>
            <span style={{ color: "white" }}>{study.value}</span>
          </Link>
        ))}
      </ul>
      </div>  
    </div>
  );
}
