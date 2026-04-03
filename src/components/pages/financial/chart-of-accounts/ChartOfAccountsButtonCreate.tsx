"use client";

import Button from "@/components/ui/button/Button";
import { chartOfAccountModalAtom } from "@/jotai/financial/chart-of-account.jotai";
import { permissionCreate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const module = "D";
const routine = "D4";

export function ChartOfAccountsButtonCreate() {
  const [_, setModal] = useAtom(chartOfAccountModalAtom);
  const [hasPermission, setHasPermission] = useState(false);
  
  useEffect(() => {
    setHasPermission(permissionCreate(module, routine));
  }, []);

  if (!hasPermission) return null;

  return <Button onClick={() => setModal(true)} type="submit" size="sm">Adicionar</Button>
}