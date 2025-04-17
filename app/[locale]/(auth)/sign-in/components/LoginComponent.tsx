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
import { FingerprintIcon } from "lucide-react";
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

export function LoginComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  //State for dialog to be by opened and closed by DialogTrigger
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");
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

  async function onPasswordReset(email: string) {
    try {
      setIsLoading(true);
      await axios.post("/api/user/passwordReset", {
        email,
      });
      toast({
        title: "Success",
        description: "Password reset email has been sent.",
      });
    } catch (error) {
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong while resetting the password.",
        });
      }
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  }

  return (
    <Card className="shadow-[0px 64px 64px -32px rgba(94, 23, 235, 0.18)] backdrop-filter-[blur(160px)] my-5 px-[40px] py-[70px] rounded-[28px]">
      <CardHeader className="space-y-5">
        <CardTitle className="text-2xl text-center">Bem vindo!</CardTitle>
        <CardDescription >Somos a sua plataforma de Customer Success.</CardDescription>
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
              <div className="flex items-center w-full ">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
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
                <span
                  className="flex px-4 pt-7 w-16"
                  onClick={() => setShow(!show)}
                >
                  <FingerprintIcon size={25} className="text-gray-400" />
                </span>
              </div>
              <div className="text-sm text-gray-500">

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger className="text-primary">
                    <span>Esqueceu a senha?</span>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="p-5">Password Reset</DialogTitle>
                      <DialogDescription className="p-5">
                        Enter your email address and we will send new password to your
                        e-mail.
                      </DialogDescription>
                    </DialogHeader>
                    {isLoading ? (
                      <LoadingComponent />
                    ) : (
                      <div className="flex px-2 space-x-5 py-5">
                        <Input
                          type="email"
                          placeholder="name@domain.com"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                          disabled={email === ""}
                          onClick={() => {
                            onPasswordReset(email);
                          }}
                        >
                          Reset
                        </Button>
                      </div>
                    )}
                    <DialogTrigger className="w-full text-right pt-5 ">
                      <Button variant={"destructive"}>Cancel</Button>
                    </DialogTrigger>
                  </DialogContent>
                </Dialog>
                {/* Dialog end */}
              </div>
              <div className="flex items-center space-x-2 mt-[24px]">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Eu aceito os <span className="text-primary">Termos de Uso</span>
                </label>
              </div>
            </div>
            <div className="grid gap-2 py-8">
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
