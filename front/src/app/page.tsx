import Image from "next/image";
import "./globals.css";
import 'bulma/css/bulma.min.css';

export default function App() {
  return (
    <div className="flex flex-col w-screen h-screen p-8 px-16">

      <nav className="flex flex-row items-center justify-start w-full">
        <h1 className="text-3xl">ZKare</h1>
      </nav>

      <main className="flex flex-row justify-between h-full items-center">

        <div className="flex flex-col gap-10">
          <span className="text-5xl text-left">
            Zero Knowledge based healthcare data <br /> distribution.
          </span>

          <button className="button is-rounded is-medium w-fit font-semibold flex flex-row gap-3 items-center">
            <span className="pt-0.5"><Image src="/login.svg" alt="img" width={20} height={20} /></span>
            Connect your wallet
          </button>
        </div>

      <Image src="/undraw_medical_care_movn.svg" alt="img" width={600} height={600} />
      </main>



    </div>
  )
}