import { FormSchema, formSchema } from "./form-schema";
import { useLocalStorage } from "./use-local-storage";
import { z } from "zod";

export function useSavedForms() {
  const [savedForms, setSavedForms] = useLocalStorage<FormSchema[]>(
    "saved-forms",
    [],
    z.array(formSchema)
  );

  return [savedForms, setSavedForms] as const;
}
