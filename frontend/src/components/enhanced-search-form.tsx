"use client";

import { Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormFieldComponent } from "./form-field";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

// Move these type definitions to a separate types file if needed
const formFieldSchema = z.object({
  title: z.string().min(1, "Název pole je povinný"),
  unit: z.string().optional(),
  type: z.enum(["numeric", "text", "date", "boolean"], {
    required_error: "Typ pole je povinný",
  }),
  keywords: z
    .array(z.string().min(1, "Klíčové slovo nesmí být prázdné"))
    .min(1, "Přidejte alespoň jedno klíčové slovo"),
});

const formSchema = z.object({
  formTitle: z.string().min(1, "Název formuláře je povinný"),
  formFields: z.array(formFieldSchema).min(1, "Přidejte alespoň jedno pole"),
});

export type FormSchema = z.infer<typeof formSchema>;

export default function Component({
  initialFormState,
  index,
}: {
  initialFormState: FormSchema;
  index: number;
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormState,
  });
  const { control, handleSubmit } = form;
  const { toast } = useToast();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formFields",
  });
  const [savedForms, setSavedForms] = useLocalStorage<FormSchema[]>(
    "saved-forms",
    []
  );
  const onSubmit = (data: FormSchema) => {
    const newForms = structuredClone(savedForms);
    newForms[index] = data;
    setSavedForms(newForms);
    toast({
      title: "Uloženo",
      description: "Formulář byl uložen do uložených formulářů.",
      variant: "default",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="formTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Název formuláře</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte název formuláře" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {fields.map((field, index) => (
            <FormFieldComponent
              key={field.id}
              control={control}
              index={index}
              onRemove={() => remove(index)}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({ title: "", unit: "", type: "text", keywords: [""] })
            }
          >
            <Plus className="h-4 w-4 mr-2" /> Přidat pole
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="space-x-2">
            <Button type="submit" variant="outline">
              <Save className="h-4 w-4 mr-2" /> Uložit formulář
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}
