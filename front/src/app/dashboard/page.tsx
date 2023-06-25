"use client";

import { useState } from "react"
import DoctorDashboard from "../components/dashboards/doctorDashboard";
import ResearcherDashboard from "../components/dashboards/researcherDashboard";
import Image from "next/image";
import { Collapse, Text, Grid, Button } from "@nextui-org/react";

export default function Dashboard() {

	type userType = "doctor" | "researcher"

	const [typeOfUser, setTypeOfUser] = useState<userType>("doctor");
	const [studies, setStudies] = useState<{
		name: string,
		description: string,
		options: {
			gender: string,
			isSmoker: boolean,
			isOverweight: boolean,
			bloodType: string,
			treatment: string,
			timestamp: string,
			heartRate: number,
		}
	}[]>([]);

	return (
		<div className="flex flex-col items-center min-h-screen p-8 px-16">
			<nav className="flex flex-row items-center justify-start w-full">
				<h1 className="text-3xl">ZKare</h1>
			</nav>

			{/* {typeOfUser === "doctor" ?
				(<DoctorDashboard></DoctorDashboard>) :
				(<ResearcherDashboard></ResearcherDashboard>)
			} */}

			<div className="flex flex-row gap-20 justify-between w-full h-full pt-12">

				<div className="flex flex-col w-full justify-start">
					<Grid.Container gap={2} className="w-full">
						<Grid className="w-full">
							<Text h3>My Studies</Text>

							<Collapse.Group splitted className="w-full">
								{studies.length ? studies.map((study, index) => {
									return (
										<Collapse title={study.name} index={index}>
											<Text>{study.description}</Text>
										</Collapse>
									)
								}) : (
									<div className="flex flex-col gap-4">
										<Text >You don't have any studies yet. Create one using the button below</Text>
										<a href="/studies" className="w-fit">
											<Button size={"sm"} css={{ background: "Black" }}>Create study</Button>
										</a>
									</div>
								)}
							</Collapse.Group>
						</Grid>
					</Grid.Container>
				</div>

				<Image src="/undraw_doctors_p6aq 2.svg" alt="img" width={500} height={500} />
			</div>
		</div >
	)
}
