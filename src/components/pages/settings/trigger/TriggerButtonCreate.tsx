"use client";

import Button from "@/components/ui/button/Button";
import { triggerModalAtom } from "@/jotai/settings/trigger.jotai";
import { permissionCreate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const module  = "A";
const routine = "A3";

export const TriggerButtonCreate = () => {
    const [_, setModal] = useAtom(triggerModalAtom);
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
};