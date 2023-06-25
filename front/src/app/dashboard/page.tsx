"use client";

import { useState } from "react"
import DoctorDashboard from "../components/dashboards/doctorDashboard";
import ResearcherDashboard from "../components/dashboards/researcherDashboard";
import Image from "next/image";
import { Collapse, Text, Grid } from "@nextui-org/react";

export default function Dashboard() {

	type userType = "doctor" | "researcher"

	const [typeOfUser, setTypeOfUser] = useState<userType>("doctor");
	const [studies, setStudies] = useState<{
		name: string,
		description: string,
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

			<div className="flex flex-row gap-20 justify-between h-full pt-12">

				<div className="flex flex-col">
					<Grid.Container gap={2}>
						<Grid>
							<Text h3>My Studies</Text>
							<Collapse.Group splitted>
								<Collapse title="Option A">
									<Text>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
										eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
										enim ad minim veniam, quis nostrud exercitation ullamco laboris
										nisi ut aliquip ex ea commodo consequat.
									</Text>
								</Collapse>
							</Collapse.Group>
						</Grid>
					</Grid.Container>
				</div>

				<Image src="/undraw_doctors_p6aq 2.svg" alt="img" width={500} height={500} />
			</div>
		</div>
	)
}
