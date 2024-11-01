import { Control, useFieldArray } from "react-hook-form";
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
import { FormSchema } from "./enhanced-search-form"; // You'll need to move the type definition

interface FormFieldComponentProps {
  control: Control<FormSchema>;
  index: number;
  onRemove: () => void;
}

export function FormFieldComponent({
  control,
  index,
  onRemove,
}: FormFieldComponentProps) {
  const {
    fields: keywords,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    name: `formFields.${index}.keywords` as "formFields.0.keywords",
  });

  return (
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
        {index > 0 && (
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
        )}
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
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte typ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="numeric">Číselný</SelectItem>
                      <SelectItem value="text">Textový</SelectItem>
                      <SelectItem value="date">Datum</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel>Klíčová slova</FormLabel>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendKeyword("")}
          >
            <Plus className="h-4 w-4 mr-2" /> Přidat klíčové slovo
          </Button>
        </div>
        {keywords.map((keyword, keywordIndex) => (
          <div key={keywordIndex} className="flex items-center space-x-2">
            <FormField
              control={control}
              name={`formFields.${index}.keywords.${keywordIndex}`}
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
            {keywordIndex > 0 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeKeyword(keywordIndex)}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Odebrat klíčové slovo</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
