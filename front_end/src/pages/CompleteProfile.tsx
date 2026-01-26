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
  
  // Get user data from localStorage
  const getUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  };

  const user = getUserData();
  
  // Create full name from first and last name
  const fullName = user?.first_name && user?.last_name 
    ? `${user.first_name} ${user.last_name}`.trim()
    : '';

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enrollment_number: "",
      institute_name: "",
      full_name: fullName,
      current_semester: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/accounts/complete-profile/");
        console.log('Fetched profile:', response.data);
        if (response.data) {
          form.reset({
            enrollment_number: response.data.enrollment_no || "",
            institute_name: response.data.college_name || "",
            full_name: response.data.full_name || fullName,
            current_semester: response.data.current_semester?.toString() || "",
          });
        }
      } catch (error) {
        console.log("No profile found, creating a new one.");
      }
    };
    fetchProfile();
  }, [form, fullName]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    
    const payload = {
      full_name: data.full_name,
      enrollment_no: data.enrollment_number,
      college_name: data.institute_name,
      current_semester: parseInt(data.current_semester),
    };
    
    console.log('Submitting payload:', payload);
    
    try {
      const response = await api.post("/accounts/complete-profile/", payload);
      console.log('Submit response:', response.data);
      
      toast({
        title: "Profile completed successfully!",
        description: "Your academic information has been saved.",
      });
      
      // Navigate to dashboard instead of upload-results
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Submit error:', error);
      console.error('Error response:', error.response?.data);
      
      toast({
        title: "Something went wrong.",
        description: error.response?.data?.error || error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-lg space-y-6 glass-card-strong p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Complete Your Profile</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Just a few more details to get started
            </p>
          </div>

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
                  <Input 
                    placeholder="Enter your current semester" 
                    {...field} 
                    type="number" 
                    min="1"
                    max="6"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={loading} className="w-full" variant="accent">
            {loading ? "Saving..." : "Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
}