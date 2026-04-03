"use client";

import Button from "@/components/ui/button/Button";
import { accountPayableModalAtom } from "@/jotai/financial/accounts-payable.jotai";
import { permissionCreate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const module = "D";
const routine = "D3";

export const AccountPayableButtonCreate = () => {
    const [_, setModal] = useAtom(accountPayableModalAtom);
    const [hasPermission, setHasPermission] = useState(false);
    
    useEffect(() => {
        setHasPermission(permissionCreate(module, routine));
    }, []);

    if (!hasPermission) return null;

    return <Button onClick={() => setModal(true)} type="button" size="sm">Adicionar</Button>
};
