import { Auth } from "../shared/Auth";
import Link from "next/link";

export default function App() {
  return <Auth>
    <p>Test Helpers</p>
    <Link href="/studies">Studies</Link>
  </Auth>;
}