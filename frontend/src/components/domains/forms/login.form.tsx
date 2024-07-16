import { useForm } from "react-hook-form";
import { loginSchema } from "./schemas/login.schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HexagonIcon } from "@/components/icons/icons";

interface LoginFormProps {
  onSubmit: (values: z.infer<typeof loginSchema>) => void;
  error: string;
  loading: boolean;
}
export default function LoginForm({
  onSubmit,
  error,
  loading,
}: LoginFormProps) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error.length > 0 && (
          <Label className="text-sm font-medium text-destructive mt-6">
            Incorrect username or password.
          </Label>
        )}
        <Button className="w-full" type="submit">
          {loading ? (
            <div className="animate-spin">
              <HexagonIcon />
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
