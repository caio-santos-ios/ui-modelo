"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { userAdmin, userLoggedAtom } from "@/jotai/auth/auth.jotai";
import { removeLocalStorage } from "@/service/config.service";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { ResetUserLogged } from "@/types/master-data/user.type";
import { getUserLogged } from "@/utils/auth.util";

export const Autorization = () => {
    const [_, setLoading] = useAtom(loadingAtom);
    const [__, setUserLogged] = useAtom(userLoggedAtom);
    const [___, setIsAdmin] = useAtom(userAdmin);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const localToken = localStorage.getItem("systemToken");
        const token = localToken ? localToken : "";

        if(!token) {
            setUserLogged(ResetUserLogged);
            setLoading(false);

            if(!["reset-password", "signup", "new-code-confirm", "confirm-account"].includes(pathname.split("/")[1])) {
                router.push("/");
                removeLocalStorage();
                setIsAdmin(false);
            };
        } else {
            setLoading(false);
            const userLogged = getUserLogged();

            setUserLogged({...userLogged});
            
            if(userLogged.admin || userLogged.master) {
                if(pathname == "/" || pathname == "/reset-password") {
                    router.push("/dashboard");
                };
            } else {
                if(pathname == "/" || pathname == "/reset-password") {
                    router.push("/master-data/profile");
                };
            };
        };
    }, [pathname, router]);

    return <></>
}