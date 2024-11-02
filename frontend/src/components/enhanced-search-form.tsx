import { Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormFieldComponent } from "./form-field";

import { useToast } from "@/hooks/use-toast";
import { FormSchema, formSchema } from "@/hooks/form-schema";
import { useSavedForms } from "@/hooks/use-saved-forms";
import { Accordion } from "./ui/accordion";

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
  const {
    control,
    handleSubmit,
    formState: { errors }
    } = form;
  const { toast } = useToast();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formFields",
  });
  const [savedForms, setSavedForms] = useSavedForms();
  const onSubmit = (data: FormSchema) => {
    const newForms = structuredClone(savedForms);
    console.log(newForms, index);
    newForms[index] = data;
    setSavedForms(newForms);
    toast({
      title: "Uloženo",
      description: "Formulář byl uložen.",
      variant: "default",
    });
  };

  const onError = () => {
    function traverseErrors(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errors: Record<string, any>,
      prefix = ""
    ): string[] {
      const messages: string[] = [];

      for (const [key, value] of Object.entries(errors)) {
        if (value?.message) {
          messages.push(`${prefix}${value.message}`);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === "object") {
              messages.push(
                ...traverseErrors(item, `${prefix}${key} ${index + 1}: `)
              );
            }
          });
        } else if (typeof value === "object") {
          messages.push(...traverseErrors(value, `${prefix}${key}: `));
        }
      }

      return messages;
    }

    const errorMessages = traverseErrors(errors);

    toast({
      title: "Chyba při ukládání",
      description: errorMessages.join("\n"),
      variant: "destructive",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="formTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Název šablony</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte název šablony" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="formCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kód diagnózy</FormLabel>
                <FormControl>
                  <Input placeholder="Zadejte kód diagnózy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Accordion type="single" collapsible>
            {fields.map((field, index) => (
              <FormFieldComponent
                key={field.id}
                control={control}
                index={index}
                onRemove={() => remove(index)}
              />
            ))}
          </Accordion>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({ title: "", unit: "", type: "string", keywords: [] })
            }
          >
            <Plus className="h-4 w-4 mr-2" /> Přidat pole
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="space-x-2">
            <Button type="submit" variant="outline">
              <Save className="h-4 w-4 mr-2" /> Uložit šablonu
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}
