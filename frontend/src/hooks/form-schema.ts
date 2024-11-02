import { z } from "zod";

// Move these type definitions to a separate types file if needed
export const formFieldSchema = z.object({
  title: z.string().min(1, "Název pole je povinný"),
  unit: z.string().optional(),
  type: z.enum(["number", "string", "date", "select"], {
    required_error: "Typ pole je povinný",
  }),
  keywords: z
    .array(z.string().min(1, "Klíčové slovo nesmí být prázdné"))
});

export const formSchema = z.object({
  uuid: z.string().uuid("UUID je povinný a musí být platný"),
  formTitle: z.string().min(1, "Název formuláře je povinný"),
  formFields: z.array(formFieldSchema),
  formCode: z.string().min(1, "Kód formuláře je povinný"),
});

export type FormSchema = z.infer<typeof formSchema>;
