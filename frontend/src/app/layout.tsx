import "./globals.css";
import { Inter } from "next/font/google";
import { WagmiProvider } from "@/utils/wagmi";
import Apollo from "@/shared/Apollo";
import { Auth } from "@/shared/Auth";
import { Config } from "@/shared/Config";
import { Eas } from "@/shared/Eas";
import 'bulma/css/bulma.min.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sismo Connect - Onchain Tutorial",
  description: "A medical research platform built on zk technology",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={inter.className}>

        {children}
        <WagmiProvider><Config><Apollo>

          <Auth>
            <Eas><div />
            </Eas>
          </Auth>
        
        </Apollo></Config></WagmiProvider>
      </body>
    </html>
  );
}

