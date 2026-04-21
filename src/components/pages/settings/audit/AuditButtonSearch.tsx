"use client";

import Button from "@/components/ui/button/Button"
import { auditModalSearchAtom } from "@/jotai/settings/audit.jotai";
import { permissionCreate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";

const module = "A";
const routine = "A4";

export const AuditButtonSearch = () => {
    const [_, setModal] = useAtom(auditModalSearchAtom);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        setHasPermission(permissionCreate(module, routine));
    }, []);

    if (!hasPermission) return null;

    return <Button onClick={() => setModal(true)} type="submit" className="" size="sm"><FaFilter /></Button>
}