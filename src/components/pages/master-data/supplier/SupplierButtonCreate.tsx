"use client";

import Button from "@/components/ui/button/Button"
import { supplierModalAtom } from "@/jotai/master-data/supplier.jotai";
import { permissionCreate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const module = "B";
const routine = "B4";

export const SupplierButtonCreate = () => {
    const [_, setModal] = useAtom(supplierModalAtom);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        setHasPermission(permissionCreate(module, routine));
    }, []);

    if (!hasPermission) return null;

    return (
        <Button onClick={() => setModal(true)} type="submit" className="" size="sm">
            Adicionar
        </Button>
    );
}