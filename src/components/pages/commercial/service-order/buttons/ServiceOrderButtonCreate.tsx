"use client";

import Button from "@/components/ui/button/Button";
import { serviceOrderModalAtom } from "@/jotai/commercial/service-order.jotai";
import { permissionCreate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import Link from "next/link";
import { useEffect, useState } from "react";

const module = "E";
const routine = "E1";

export const ServiceOrderButtonCreate = () => {
    const [_, setModal] = useAtom(serviceOrderModalAtom);

    const [hasPermission, setHasPermission] = useState(false);
    
    useEffect(() => {
        setHasPermission(permissionCreate(module, routine));
    }, []);

    if (!hasPermission) return null;
    
    return <Button onClick={() => setModal(true)} type="submit" size="sm">Adicionar</Button>
}