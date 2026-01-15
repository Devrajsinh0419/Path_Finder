
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  enrollment_number: z.string().min(1, {
    message: "Enrollment number is required.",
  }),
  institute_name: z.string().min(1, {
    message: "Institute name is required.",
  }),
  full_name: z.string().min(1, {
    message: "Full name is required.",
  }),
  current_semester: z.string().min(1, {
    message: "Current semester is required.",
  }),
});

export function CompleteProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enrollment_number: "",
      institute_name: "",
      full_name: "",
      current_semester: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/accounts/complete-profile/");
        if (response.data) {
          form.reset({
            ...response.data,
            current_semester: response.data.current_semester.toString(),
          });
        }
      } catch (error) {
        // It's okay if it fails, means profile doesn't exist yet
        console.log("No profile found, creating a new one.");
      }
    };
    fetchProfile();
  }, [form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      await api.post("/accounts/complete-profile/", {
        ...data,
        current_semester: parseInt(data.current_semester),
      });
      toast({
        title: "Profile completed successfully!",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong.",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-lg space-y-6 p-8">
            <h2 className="text-2xl font-bold text-center">Complete Your Profile</h2>
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="enrollment_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enrollment Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your enrollment number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="institute_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institute Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your institute name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="current_semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Semester</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your current semester" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Submit"}
            </Button>
        </form>
      </Form>
    </div>
  );
}
