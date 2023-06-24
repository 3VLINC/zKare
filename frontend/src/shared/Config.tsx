"use client";
import { PropsWithChildren, createContext, useContext } from "react";

const ConfigContext = createContext({
    eas: {
        contractAddress: "",
        schemas: {
            doctor: "",
            study: ""
        }
    }
});

export const Config = ({ children }: PropsWithChildren) => {
    return <ConfigContext.Provider value={{
        eas: {
            contractAddress: "0x1a5650d0ecbca349dd84bafa85790e3e6955eb84",
            schemas: {
                doctor: "0x234dee4d3e6a625b4121e2042d6267058755e53a2ecc55555da51a1e6f06cc58",
                study: "0x4e56f643c8049d7f66206f1b6c2f1d5f4ad7927d527bbca09866ad90311c4e79"
            }
        }}}>
        {children}
    </ConfigContext.Provider>
}

export const useConfig = () => useContext(ConfigContext);