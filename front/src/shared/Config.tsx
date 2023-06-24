"use client";
import { PropsWithChildren, createContext, useContext } from "react";

const ConfigContext = createContext({
    eas: {
        contractAddress: "234dee4d3e6a625b4121e2042d6267058755e53a2ecc55555da51a1e6f06cc58",
        schemas: {
            doctor: ""
        }
    }
});

export const Config = ({ children }: PropsWithChildren) => {
    return <ConfigContext.Provider value={{
        eas: {
            contractAddress: "234dee4d3e6a625b4121e2042d6267058755e53a2ecc55555da51a1e6f06cc58",
            schemas: {
                doctor: ""
            }
        }}}>
        {children}
    </ConfigContext.Provider>
}

export const useConfig = () => useContext(ConfigContext);