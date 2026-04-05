"use client";

import Button from "@/components/ui/button/Button"
import { customerModalAtom } from "@/jotai/master-data/customer.jotai";
import { userModalAtom } from "@/jotai/master-data/user.jotai";
import { permissionCreate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const module = "B";
const routine = "B3";

export const CustomerButtonCreate = () => {
    const [_, setModal] = useAtom(customerModalAtom);
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