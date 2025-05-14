"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
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
import { Eye, EyeClosed, FingerprintIcon } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import LoadingComponent from "@/components/LoadingComponent";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/ui/password-input";

export function LoginComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { toast } = useToast();

  const router = useRouter();

  const formSchema = z.object({
    email: z.string().min(3).max(50),
    password: z.string().min(8).max(50),
  });

  type LoginFormValues = z.infer<typeof formSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //Login with username(email)/password
  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const status = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
      });
      //console.log(status, "status");
      if (status?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: status.error,
        });
      }
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error!,
      });
    } finally {
      setIsLoading(false);
      router.push("/");
    }
  }

  return (
    <Card className="shadow-soft-cs backdrop-blur-soft-cs my-5 px-[24px] py-[40px] rounded-[28px] mx-[24px] md:mx-0 w-[330px] md:w-[480px]">
      <CardHeader className="p-0 space-y-5">
        <CardTitle className="text-2xl text-center">Bem vindo!</CardTitle>
        <CardDescription className="text-center">Somos a sua plataforma de Customer Success.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 mt-[28px] p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="exemplo@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <PasswordInput
                        className="w-full"
                        disabled={isLoading}
                        placeholder="Pelo menos 8 caracteres"
                        type={show ? "text" : "password"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm text-gray-500">
                <Link href="/reset-password" className="text-primary">Esqueceu a senha?</Link>
              </div>
            </div>
            <div className="grid gap-2 mt-[20px]">
              <Button
                disabled={isLoading}
                type="submit"
                className="flex gap-2 h-12"
              >
                <span
                  className={
                    isLoading
                      ? " border rounded-full px-3 py-2 animate-spin"
                      : "hidden"
                  }
                >
                  N
                </span>
                <span className={isLoading ? " " : "hidden"}>Aguarde ...</span>
                <span className={isLoading ? "hidden" : ""}>Entrar</span>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
