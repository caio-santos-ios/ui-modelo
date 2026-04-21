import { ResetUserLogged, TUserLogged } from "@/types/master-data/user.type";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
    sub: string;
    photo: string;
    name: string;
    email: string;
    admin: string;
    master: string;
    role: string;
    blocked: boolean;
    modules: string;
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
    
    const token = localStorage.getItem("systemToken") ?? "";
    if (!token) return ResetUserLogged;

    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    
    return {
        email:  decoded.email,
        name:   decoded.name,
        photo:  decoded.photo,
        id: decoded.sub,
        admin:  decoded.admin == "True",
        master: decoded.master == "True",
        role: decoded.role,
        blocked: decoded.blocked,
        modules: JSON.parse(decoded.modules),
    };
};