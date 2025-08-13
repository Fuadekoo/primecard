"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAction from "@/hooks/useActions";
import { authenticate } from "@/actions/admin/authentication";
import { Input } from "@heroui/input";
import { Button } from "@heroui/react";
import Loading from "@/components/loading";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const [, action, loading] = useAction(authenticate, [
    ,
    (response) => {
      if (response) {
        addToast({
          title: "Login",
          description: response.message,
        });
        router.push("/dashboard");
      } else {
        addToast({
          title: "Login",
          description: "Login successful!",
        });
      }
    },
  ]);

  return (
    <div className="h-dvh w-dvw flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
          {/* Welcome to Digital Menu */}
          login
        </h1>
        <form onSubmit={handleSubmit(action)} className="space-y-5">
          <div>
            <Input
              type="text"
              placeholder="username"
              {...register("username")}
              className="w-full"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            isDisabled={loading}
            color="secondary"
            variant="flat"
            type="submit"
            className="w-full"
          >
            {loading ? <Loading /> : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Page;
