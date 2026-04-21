"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { resolveResponse } from "@/service/config.service";
import { ResetSignUp, TSignUp } from "@/types/auth/signUp.type";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../ui/button/Button";
import { Logo } from "../logo/Logo";

interface Props {
  password: string;
}

interface Criterion {
  label: string;
  test: (p: string) => boolean;
}

const criteria: Criterion[] = [
  { label: "Letra minúscula", test: (p) => /[a-z]/.test(p) },
  { label: "Letra maiúscula", test: (p) => /[A-Z]/.test(p) },
  { label: "Número",          test: (p) => /[0-9]/.test(p) },
  { label: "Caractere especial (@, #...)", test: (p) => /[@$!%*?&_#^]/.test(p) },
  { label: "Mínimo 8 caracteres", test: (p) => p.length >= 8 },
];

const levels = [
  { label: "Muito fraca", color: "bg-red-500"    },
  { label: "Fraca",       color: "bg-orange-400" },
  { label: "Média",       color: "bg-yellow-400" },
  { label: "Boa",         color: "bg-blue-400"   },
  { label: "Ótima",       color: "bg-green-500"  },
];

export function PasswordStrength({ password }: Props) {
  // if (!password) return null;

  const score = criteria.filter((c) => c.test(password)).length;
  const level = levels[score - 1] ?? levels[0];
  const percent = (score / criteria.length) * 100;

  return (
    <div className="mt-2 space-y-2">
      <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${level.color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {
        password && (
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Força da senha:{" "}
            <span className={`font-semibold ${
              score <= 1 ? "text-red-500" :
              score === 2 ? "text-orange-400" :
              score === 3 ? "text-yellow-500" :
              score === 4 ? "text-blue-400" :
              "text-green-500"
            }`}>
              {level.label}
            </span>
          </p>
        )
      }

      <ul className="grid grid-cols-2 gap-1">
        {criteria.map((c) => {
          const ok = c.test(password);
          return (
            <li key={c.label} className="flex items-center gap-1.5 text-xs">
              <span className={`text-base leading-none ${ok ? "text-green-500" : "text-gray-300 dark:text-gray-600"}`}>
                {ok ? "✓" : "○"}
              </span>
              <span className={ok ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}>
                {c.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function SignUpForm() {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors }} = useForm<TSignUp>({
    defaultValues: ResetSignUp
  });
  
  const passwordValue = watch("password");

  const create: SubmitHandler<TSignUp> = async (body: TSignUp) => {
    try {
      setIsLoading(true);
      const {data} = await api.post(`/auth/register`, body);
      resolveResponse({status: 201, message: data.result.message});
      
      setTimeout(() => {
        reset(ResetSignUp);
        setIsChecked(false);
        router.push("confirm-account")
      }, 1000);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setValue("privacyPolicy", isChecked);
  }, [isChecked]);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full max-w-[90dvw] h-dvh overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto py-4">
        <div className="flex justify-center mb-6">
          <Logo width={110} height={110}/>
        </div>
        <div>
          <form onSubmit={handleSubmit(create)}>
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-4">
                <Label title="Nome"/>
                <input placeholder="Seu nome" {...register("name")} type="text" className="input-erp-primary input-erp-default"/>
              </div>

              <div className="col-span-4">
                <Label title="E-mail"/>
                <input placeholder="Seu e-mail" {...register("email")} type="email" className="input-erp-primary input-erp-default"/>
              </div>

              <div className="col-span-4">
                <Label title="Senha"/>
                <div className="relative">
                  <input placeholder="Sua senha" {...register("password")} type={showPassword ? "text" : "password"} className="input-erp-primary input-erp-default"/>
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute z-1 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div className="col-span-4">
                <PasswordStrength password={passwordValue} />
              </div>

              <div className="col-span-4 flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  Ao criar uma conta, você concorda com os termos {" "}
                  <span className="text-gray-800 dark:text-white/90">
                    Termos e Condições,
                  </span>{" "}
                  e nosso{" "}
                  <span className="text-gray-800 dark:text-white">
                    Política de Privacidade
                  </span>
                </p>
              </div>
              <div className="col-span-4">
                <Button type="submit" className="w-full" size="sm">Cadastrar</Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Já tenho uma conta?
              <Link
                href="/"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              > Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
