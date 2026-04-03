"use client";

import Button from "@/components/ui/button/Button";
import { accountReceivableModalAtom } from "@/jotai/financial/accounts-receivable.jotai";
import { permissionCreate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const module = "D";
const routine = "D2";

export const AccountReceivableButtonCreate = () => {
    const [_, setModal] = useAtom(accountReceivableModalAtom);
    const [hasPermission, setHasPermission] = useState(false);
        
    useEffect(() => {
        setHasPermission(permissionCreate(module, routine));
    }, []);

    if (!hasPermission) return null;

    return <Button onClick={() => setModal(true)} type="submit" size="sm">Adicionar</Button>
};
