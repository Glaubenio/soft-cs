"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { useRouter } from "next/navigation";

interface Props {
  email: string;
  otp: string;
}
export function UpdatePassword({ email, otp }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { toast } = useToast();

  const formSchema = z.object({
    password: z.string().min(3).max(50),
    password_confirmation: z.string().min(3).max(50),
  });


  type LoginFormValues = z.infer<typeof formSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const passwordValue = form.watch("password");


  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);
      await axios.post("/api/user/updatePassword", {
        password: data.password,
        password_confirmation: data.password_confirmation,
        email: email,
        otp: otp
      });
      toast({
        title: "Success",
        description: "Senha alterada com sucesso. Você já pode fazer login."
      });
      router.push("/sign-in");
    } catch (error: any) {
      if (error) {
        const errorMessage = error.response?.data?.message || "Erro desconhecido";
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const passwordDoNotContainsSpecialCharacter = (password: string) => {
    const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
    return !specialCharacters.test(password);
  };

  const passwordContainsNameOrEmail = (password: string) => {
    const name = email.split("@")[0];
    return password.includes(name) || password.includes(email);
  };

  const passwordDoNotContainLowerAndUpperCase = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    return !hasUpperCase && !hasLowerCase;
  }

  const passwordDoNotContainNumber = (password: string) => {
    const hasNumber = /\d/.test(password);
    return !hasNumber;
  };

  const passwordIsWeak = (password: string) => {
    const doNotContainLowerAndUpperCaseLetters = passwordDoNotContainLowerAndUpperCase(password);
    const doNotContainNumber = passwordDoNotContainNumber(password);
    const doNotContainSpecialChars = passwordDoNotContainsSpecialCharacter(password);
    const containNameOrEmail = passwordContainsNameOrEmail(password);
    const isLongEnough = password.length >= 8;
    return (
      doNotContainLowerAndUpperCaseLetters ||
      doNotContainNumber ||
      doNotContainSpecialChars ||
      !isLongEnough ||
      containNameOrEmail
    );
  };

  const getPasswordIcon = (password: string, passwordCheckCallback: (password: string) => boolean) => {
    if (!password) {
      return <XCircle className="h-[16px] w-[16px] text-dot-red" />;
    }
    if (passwordCheckCallback(password)) {
      return <XCircle className="h-[16px] w-[16px] text-dot-red" />;
    } else {
      return <CheckCircle className="h-[16px] w-[16px] text-dot-green" />;
    }
  }

  return (
    <Card className="shadow-soft-cs backdrop-blur-soft-cs my-5 px-[40px] py-[70px] rounded-[28px] max-w-[480px]">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Cadastrar nova senha</CardTitle>
        <div className="flex gap-1 text-[14px] mt-[8px]">
          {getPasswordIcon(passwordValue, passwordIsWeak)}
          Força da senha:
          {passwordIsWeak(passwordValue) ? (<div className="text-dot-red">Fraca</div>) : (<div className="text-dot-green">Fraca</div>)}
        </div>
        <div className="flex gap-1 text-[14px] mt-[8px]">
          {getPasswordIcon(passwordValue, passwordDoNotContainLowerAndUpperCase)}
          Deve conter letras maiúsculas e minúsculas
        </div>
        <div className="flex gap-1 text-[14px] mt-[8px]">
          {getPasswordIcon(passwordValue, passwordDoNotContainNumber)}
          Deve conter números
        </div>
        <div className="flex gap-1 text-[14px] mt-[8px]">
          {getPasswordIcon(passwordValue, passwordContainsNameOrEmail)}
          Não pode conter nome ou endereço de email
        </div>
        <div className="flex gap-1 text-[14px] mt-[8px]">
          {getPasswordIcon(passwordValue, (password: string) => password.length < 8)}
          Pelo menos 8 caracteres
        </div>
        <div className="flex gap-1 text-[14px] mt-[8px]">
          {getPasswordIcon(passwordValue, passwordDoNotContainsSpecialCharacter)}
          Precisa conter um caractere especial (!@#$%^&*(),.?":{ }|<></>)
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 min-w-[400px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <div className="grid gap-2 py-8 grid-cols-2">
              <Button
                disabled={isLoading || passwordIsWeak(passwordValue)}
                type="submit"
                className="flex gap-2 h-12"
              >

                <span className={isLoading ? " " : "hidden"}>Aguarde ...</span>
                <span className={isLoading || passwordIsWeak(passwordValue) ? "hidden" : "flex"}>Confirmar</span>
                <span className={passwordIsWeak(passwordValue) ? "flex" : "hidden"}>Senha fraca</span>
                <span
                  className={
                    isLoading
                      ? " border rounded-full px-3 py-2 animate-spin"
                      : "hidden"
                  }
                >
                  S
                </span>
                <span
                  className={
                    isLoading
                      ? " hidden"
                      : ""
                  }
                >
                  <CheckCircle className="h-4 w-4" />
                </span>
              </Button>
              <Button
                disabled={isLoading}
                variant="outline"
                className="flex gap-2 h-12 bg-white"
              >
                <Link
                  href="/sign-in"
                  className="flex gap-2 h-12 items-center"
                >
                  Cancelar
                  <span>
                    <XCircle className="h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
