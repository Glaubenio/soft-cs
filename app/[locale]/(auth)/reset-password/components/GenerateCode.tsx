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
import { Input } from "@/components/ui/input";
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

interface Props {
  onCodeGenerated: (email: string) => void;
}
export function GenerateCode({ onCodeGenerated }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();


  const formSchema = z.object({
    email: z.string().min(3).max(50),
  });

  type LoginFormValues = z.infer<typeof formSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });


  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);
      await axios.post("/api/user/passwordReset", {
        email: data.email,
      });
      onCodeGenerated(data.email);
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

  return (
    <Card className="shadow-soft-cs backdrop-blur-soft-cs my-5 px-[40px] py-[70px] rounded-[28px] max-w-[480px]">
      <CardHeader className="space-y-5">
        <CardTitle className="text-2xl text-center">Recuperar senha</CardTitle>
        <CardDescription className="text-center">Forneça o email vinculado a uma conta para o qual você deseja enviar o link de recuperação de senha.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 min-w-[400px]">
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

            </div>
            <div className="grid gap-2 py-8 grid-cols-2">
              <Button
                disabled={isLoading}
                type="submit"
                className="flex gap-2 h-12"
              >

                <span className={isLoading ? " " : "hidden"}>Aguarde ...</span>
                <span className={isLoading ? "hidden" : "flex"}>Solictar Link</span>
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
