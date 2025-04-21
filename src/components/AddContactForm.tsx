
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Contact } from "./ContactCard";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().regex(/^\+?[0-9]{10,14}$/, "Invalid phone number format.")
});

interface AddContactFormProps {
  onAdd: (contact: Omit<Contact, "id">) => void;
  editingContact?: Contact | null;
  onCancel?: () => void;
}

const AddContactForm = ({ 
  onAdd, 
  editingContact = null,
  onCancel
}: AddContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editingContact?.name || "",
      phone: editingContact?.phone || ""
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Ensure we're passing required fields to satisfy the type
      onAdd({
        name: values.name,
        phone: values.phone
      });
      if (!editingContact) {
        form.reset({ name: "", phone: "" });
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-slide-up">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Emergency Contact Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+910123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="w-full bg-raksha-purple hover:bg-raksha-purple-dark" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : editingContact ? "Update Contact" : "Add Contact"}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AddContactForm;
