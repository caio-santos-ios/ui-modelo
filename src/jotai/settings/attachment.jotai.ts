import { ResetAttachment, TAttachment } from "@/types/setting/attachment.type";
import { atom } from "jotai";

export const attachmentAtom = atom<TAttachment>(ResetAttachment);
export const attachmentModalAtom = atom<boolean>(false);