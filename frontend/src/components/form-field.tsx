import { Control, useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
import { FormSchema } from "@/hooks/form-schema";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FormFieldComponentProps {
  control: Control<FormSchema>;
  index: number;
  onRemove: () => void;
}

const formFieldTypeOptions: Array<{ label: string, value: FormSchema["formFields"][number]["type"] }> = [{
  label: "Číslo",
  value: "number",
}, {
  label: "Text",
  value: "string",
}, {
  label: "Datum",
  value: "date",
},{
  label: "Výběr z hodnot",
  value: "select",
}
]

export function FormFieldComponent({
  control,
  index,
  onRemove,
}: FormFieldComponentProps) {
  const {
    fields,

  } = useFieldArray({
    control,
    name: "formFields",
  });

  const { fields: keywords, append: appendKeyword, remove: removeKeyword } = useFieldArray({
    control,
    name: `formFields.${index}.keywords`,
  })

  const { fields: selectValues, append: appendSelectValue, remove: removeSelectValue } = useFieldArray({
    control,
    name: `formFields.${index}.selectValues`
  })

  const title = useWatch({ control, name: `formFields.${index}.title` });
  const type = useWatch({ control, name: `formFields.${index}.type` });

  return (
    <AccordionItem value={`formField-${index}`}>
      <AccordionTrigger><span className={`${title.length > 0 ? undefined : "text-gray-500"}`}>{title.length > 0 ? title : "Prázdné pole"}</span></AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between gap-4">
            <FormField
              control={control}
              name={`formFields.${index}.title`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Název pole</FormLabel>
                  <FormControl>
                    <Input placeholder="Zadejte název pole" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
                <FormLabel className="opacity-0 select-none">test</FormLabel>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={onRemove}
                >
                  <Minus className="h-4 w-4 mr-2" /> Odebrat pole
                </Button>
              </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormField
                control={control}
                name={`formFields.${index}.unit`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Očekávaná jednotka</FormLabel>
                    <FormControl>
                      <Input placeholder="např. mg/dL, mmHg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={control}
                name={`formFields.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ pole</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        name={field.name}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte typ" />
                        </SelectTrigger>
                        <SelectContent>
                          {formFieldTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {type === 'select' && 
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSelectValue({
                    value: ""
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Přidat hodnotu
                </Button>
                {selectValues.map((select, selectValueIndex) => (
                  <div key={select.id} className="flex items-start space-x-2">
                    <FormField
                      control={control}
                      name={`formFields.${index}.selectValues.${selectValueIndex}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={`Hodnota ${selectValueIndex + 1}`}
                              {...field}
                              className="flex-grow"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeSelectValue(selectValueIndex)}
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Odebrat hodnotu</span>
                    </Button>
                  </div>
                ))}
            </div>
          }
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FormLabel>
                Klíčová slova{" "}
                {fields.length === 0 && (
                  <div className="text-xs text-gray-600">
                    Přidejte alespoň jedno klíčové slovo
                  </div>
                )}
              </FormLabel>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendKeyword({
                  value: ""
                })}
              >
                <Plus className="h-4 w-4 mr-2" /> Přidat klíčové slovo
              </Button>
            </div>
            {keywords.map((keyword, keywordIndex) => (
              <div key={keyword.id} className="flex items-start space-x-2">
                <FormField
                  control={control}
                  name={`formFields.${index}.keywords.${keywordIndex}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={`Klíčové slovo ${keywordIndex + 1}`}
                          {...field}
                          className="flex-grow"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeKeyword(keywordIndex)}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Odebrat klíčové slovo</span>
                  </Button>
              </div>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
