"use client";

import Button from "@/components/ui/button/Button"
import { paymentMethodModalAtom } from "@/jotai/financial/payment-method.jotai";
import { permissionCreate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const module = "D";
const routine = "D1";

export const PaymentMethodButtonCreate = () => {
    const [_, setModal] = useAtom(paymentMethodModalAtom);
    const [hasPermission, setHasPermission] = useState(false);
    
    useEffect(() => {
        setHasPermission(permissionCreate(module, routine));
    }, []);

    if (!hasPermission) return null;
    
    return <Button onClick={() => setModal(true)} type="submit" className="" size="sm">Adicionar</Button>
}