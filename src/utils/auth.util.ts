import { ResetUserLogged, TUserLogged } from "@/types/master-data/user.type";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
    sub: string;
    email: string;
    unique_name?: string;
};

const isBrowser = typeof window !== "undefined";

export const getLoggedUserId = (): string => {
    try {
        if (!isBrowser) return "";
        const token = localStorage.getItem("telemovviToken") ?? "";
        if (!token) return "";
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.sub ?? "";
    } catch {
        return "";
    }
};

export const getUserLogged = (): TUserLogged => {
    if (!isBrowser) return ResetUserLogged;
    
    const id     = localStorage.getItem("telemovviId")     ?? "";
    const admin  = localStorage.getItem("telemovviAdmin")  ?? "false";
    const master = localStorage.getItem("telemovviMaster") ?? "false";

    return {
        email:  "",
        name:   "",
        photo:  "",
        id,
        admin:  admin  === "true",
        master: master === "true",
    };
};