import { z } from "zod";

// Move these type definitions to a separate types file if needed
export const formFieldSchema = z.object({
  title: z.string().min(1, "Název pole je povinný"),
  unit: z.string().optional(),
  type: z.enum(["numeric", "text", "date"], {
    required_error: "Typ pole je povinný",
  }),
  keywords: z
    .array(z.string().min(1, "Klíčové slovo nesmí být prázdné"))
    .min(1, "Přidejte alespoň jedno klíčové slovo"),
});

export const formSchema = z.object({
  formTitle: z.string().min(1, "Název formuláře je povinný"),
  formFields: z.array(formFieldSchema).min(1, "Přidejte alespoň jedno pole"),
});

export type FormSchema = z.infer<typeof formSchema>;
