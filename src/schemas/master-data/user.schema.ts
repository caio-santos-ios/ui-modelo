import { z } from "zod";

export const userCreateSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    profileUserId: z.string().min(1, "Perfil é obrigatório"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
})