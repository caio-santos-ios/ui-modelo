"use client";

import Button from "../ui/button/Button";
import { useAtom } from "jotai";
import { SubmitHandler, useForm } from "react-hook-form";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse, saveLocalStorage } from "@/service/config.service";
import { useEffect, useRef, useState } from "react";
import { ResetUserProfile, TUser, TUserLogged, TUserProfile } from "@/types/master-data/user.type";
import { decodedToken, getUserLogged } from "@/utils/auth.util";
import { userAtom, userModalUpdatePasswordAtom } from "@/jotai/master-data/user.jotai";
import { UserModalUpdatePassword } from "../pages/master-data/user/UserModalUpdatePassword";
import { profileModalAtom } from "@/jotai/master-data/profile.jotai";
import { ProfileModalCreate } from "../pages/master-data/profile/ProfileModalCreate";
import { userLoggedAtom } from "@/jotai/auth/auth.jotai";

const roleLabel: Record<string, string> = {
  User: "Usuário",
  Client: "Cliente",
  Employee: "Colaborador",
  Director: "Diretor(a)",
  Master: "Master",
  Admin: "Administrador",
};

export default function UserMetaCard() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [__, setModal] = useAtom(profileModalAtom);
  const [user, setUser] = useAtom(userAtom);
  const [___, setModalUpdatePassword] = useAtom(userModalUpdatePasswordAtom);
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, reset, watch, getValues } = useForm<TUserProfile>({
    defaultValues: ResetUserProfile,
  });

  // const settingNotification = watch("settingNotification");

  const [userLogged, setUserLogged] = useAtom(userLoggedAtom);

  const getById = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/users/${id}`, configApi());
      const result = data.result.data;
      reset(result);
      setUser(result);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File[]) => {
    const formBody = new FormData();
    formBody.append("id", watch("id")!);
    formBody.append("photo", file[0]);
    try {
      setLoading(true);
      const { data } = await api.put(`/users/profile-photo-token`, formBody, configApi(false));
      const result = data.result.data;
      const userLogged: TUserLogged = decodedToken(result.token);
      setUserLogged(userLogged);
      saveLocalStorage(result, true);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettingsNotification: SubmitHandler<TUser> = async (body: TUser) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/users/setting-notifications`, body, configApi());
      resolveResponse({ status: 200, message: data.result.message });
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeName = (name: string) => name?.slice(0, 1).toUpperCase() ?? "";

  useEffect(() => {
    setMounted(true);
    setUserLogged(getUserLogged());
    getById(getUserLogged().id);
  }, []);

  return (
    <>
      <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800 mb-4">

        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 flex-1 min-w-0">

            <div className="relative shrink-0 group">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-brand-500 dark:ring-offset-gray-900 transition-all"
              >
                {mounted && userLogged.photo ? (
                  <img
                    src={userLogged.photo}
                    alt="Foto do usuário"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-50 dark:bg-brand-900/20">
                    <span className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                      {normalizeName(userLogged.name)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) uploadFile(Array.from(files));
                }}
              />
            </div>

            <div className="flex flex-col gap-2 min-w-0 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap justify-center sm:justify-start">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {userLogged.name}
                </h4>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{userLogged.email}</p>

              <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-1">
                {userLogged.role && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    {roleLabel[userLogged.role] ?? userLogged.role}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 shrink-0 self-start sm:self-center w-full md:w-60">
            <Button className="w-full" size="sm" variant="outline" onClick={() => setModalUpdatePassword(true)}>
              Alterar senha
            </Button>
            <Button className="w-full" size="sm" variant="primary" onClick={() => setModal(true)}>
              Editar
            </Button>
          </div>

        </div>
      </div>

      {/* <ProfileNotificationSettingsCard onSave={(settings) => { updateSettingsNotification({...ResetUser, id: user.id, settingNotification: settings}) }} defaultValues={settingNotification} /> */}

      <ProfileModalCreate />
      <UserModalUpdatePassword />
    </>
  );
}