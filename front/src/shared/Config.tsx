"use client";
import { PropsWithChildren, createContext, useContext } from "react";

const ConfigContext = createContext({
    eas: {
        contractAddress: "",
        schemas: {
            doctorStudy: {
                address: "",
                schema: ""
            },
            study: {
                address: "",
                schema: ""
            }
        }
    }
});

export const Config = ({ children }: PropsWithChildren) => {
    return <ConfigContext.Provider value={{
        eas: {
            contractAddress: "0x1a5650d0ecbca349dd84bafa85790e3e6955eb84",
            schemas: {
                doctorStudy: {
                    address: "0x41eebd08fbd134e2cdffeac92795b28d1c591275e8baef8b5a9fcd9b8fa2c0ca",
                    schema: "string doctorName,bytes32 studyId"
                },
                study: {
                    address: "0x4e56f643c8049d7f66206f1b6c2f1d5f4ad7927d527bbca09866ad90311c4e79",
                    schema: ""
                }
            }
        }}}>
        {children}
    </ConfigContext.Provider>
}

export const useConfig = () => useContext(ConfigContext);