"use client";
import React, { useEffect, useState } from "react";
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
import { CheckCircle, Edit, Repeat, XCircle } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

interface Props {
  email: string;
  onCodeVerified: (code: string) => void;
  onEmailChangeRequest: () => void;
}
export function VerifyCode({ onCodeVerified, onEmailChangeRequest, email }: Props) {
  const [remainingTimeInSeconds, setRemainingTimeInSeconds] = useState(5 * 60);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>();

  const { toast } = useToast();

  const formSchema = z.object({
    otp: z.string().max(6),
  });

  type LoginFormValues = z.infer<typeof formSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = form.watch("otp");

  useEffect(() => {
    startTimer()
  }, [])

  const clearTimer = () => clearInterval(timer);
  const startTimer = () => {
    clearTimer();
    const newInterval = setInterval(() => {
      setRemainingTimeInSeconds((s) => (s -= 1));
    }, 1000);
    setTimer(newInterval);
  };

  useEffect(() => {
    if (otpValue.length === 6) {
      form.handleSubmit(onSubmit)();
    }
  }, [otpValue])


  async function generateNewCode() {
    try {
      setIsLoading(true);
      await axios.post("/api/user/passwordReset", {
        email: email,
      });
      toast({
        variant: "default",
        title: "Código enviado",
        description: "Um novo código foi enviado para o seu e-mail.",
      });
      setRemainingTimeInSeconds(5 * 60);
      startTimer();
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


  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/user/verifyCode", {
        email: email,
        otp: data.otp
      });
      onCodeVerified(data.otp);
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

  const getTimerString = () => {
    const minutes = Math.floor(remainingTimeInSeconds / 60);
    const remainingSeconds = remainingTimeInSeconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }


  return (
    <Card className="shadow-soft-cs backdrop-blur-soft-cs my-5 px-[24px] py-[40px] rounded-[28px] mx-[24px] md:mx-0 w-[330px] md:w-[480px]">
      <CardHeader className="p-0 space-y-5">
        <CardTitle className="text-2xl text-center">Código de verificação</CardTitle>
        <CardDescription className="text-center">Digite o código de verificação que enviamos para o seu e-mail ou celular para redefinir sua senha.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 mt-[28px] p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2 justify-center">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP maxLength={6}  {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <div className="grid gap-2 mt-[48px] grid-cols-2">
              <Button
                disabled={remainingTimeInSeconds > 0 || isLoading}
                type="submit"
                onClick={generateNewCode}
                className="flex gap-2 h-12"
              >

                <span className={isLoading ? " " : "hidden"}>Aguarde ...</span>
                <span className={isLoading ? "hidden" : "flex"}>Gerar novo código</span>
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
                  <Repeat className="h-4 w-4" />
                </span>
              </Button>
              <Button
                onClick={() => onEmailChangeRequest()}
                disabled={isLoading}
                variant="outline"
                className="flex gap-2 h-12 bg-white"
              >
                Alterar Email
                <span>
                  <Edit className="h-4 w-4" />
                </span>
              </Button>
            </div>
            {
              remainingTimeInSeconds >= 0 && (
                <div className="grid grid-cols-1 font-[400] text-light-gray text-[12px]">
                  Aguarde {getTimerString()} minutos para solicitar um novo código
                </div>
              )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
