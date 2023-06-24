"use client";
import { PropsWithChildren, createContext, useContext } from "react";

const ConfigContext = createContext({
    eas: {
        contractAddress: "",
        schemas: {
            doctor: ""
        }
    }
});

export const Config = ({ children }: PropsWithChildren) => {
    return <ConfigContext.Provider value={{
        eas: {
            contractAddress: "0x1a5650d0ecbca349dd84bafa85790e3e6955eb84",
            schemas: {
                doctor: "0x234dee4d3e6a625b4121e2042d6267058755e53a2ecc55555da51a1e6f06cc58"
            }
        }}}>
        {children}
    </ConfigContext.Provider>
}

export const useConfig = () => useContext(ConfigContext);