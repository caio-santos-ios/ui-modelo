"use client";

import Button from "@/components/ui/button/Button"
import { userModalAtom } from "@/jotai/master-data/user.jotai";
import { useAtom } from "jotai";

export const UserButtonCreate = () => {
    const [_, setModal] = useAtom(userModalAtom);

    return (
        <Button onClick={() => setModal(true)} type="submit" className="" size="sm">Adicionar</Button>
    )
}