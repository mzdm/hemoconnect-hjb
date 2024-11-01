import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  ClipboardList,
  FormInput,
  Plus,
  Trash2,
  FileDown,
  FileUp,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

type FormSchema = {
  formTitle: string;
  formFields: {
    title: string;
    type: "boolean" | "date" | "numeric" | "text";
    keywords: string[];
    unit?: string | undefined;
  }[];
};

export default function Component(
  {
    onFormSelect,
  }: {
    onFormSelect: (schema: FormSchema, index: number) => void;
  } = {
    onFormSelect: () => {},
  }
) {
  const [savedForms, setSavedForms] = useLocalStorage<FormSchema[]>(
    "saved-forms",
    []
  );
  const { toast } = useToast();
  const plusButton = (
    <>
      <Button
        variant="default"
        className="w-full justify-center gap-2"
        onClick={() =>
          onFormSelect({ formTitle: "", formFields: [] }, savedForms.length + 1)
        }
      >
        <Plus className="h-4 w-4" />
        Vytvořit formulář
      </Button>
      <div className="flex gap-4 justify-center items-center mt-4">
        <Button
          variant="outline"
          className="w-full justify-center gap-2 "
          onClick={() => {
            const dataStr = JSON.stringify(savedForms);
            const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
              dataStr
            )}`;
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", dataUri);
            downloadAnchorNode.setAttribute("download", "saved-forms.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
          }}
        >
          <FileDown />
          Exportovat formuláře
        </Button>

        <Button
          variant="outline"
          className="w-full justify-center gap-2"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = e => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                  try {
                    const forms = JSON.parse(e.target?.result as string);
                    setSavedForms([...savedForms, ...forms]);
                  } catch (e) {
                    toast({
                      title:
                        "Chyba v parsování JSON souboru" +
                        (e instanceof Error ? e.message : ""),
                      variant: "destructive",
                    });
                  }
                };
                reader.readAsText(file);
              }
            };
            input.click();
          }}
        >
          <FileUp />
          Importovat formuláře
        </Button>
      </div>
    </>
  );

  // Get appropriate icon based on form field types
  const getFormIcon = (form: FormSchema) => {
    const hasMultipleTypes = new Set(form.formFields.map(f => f.type)).size > 1;
    if (hasMultipleTypes) {
      return <FormInput className="h-4 w-4" />;
    }
    const type = form.formFields[0]?.type;
    switch (type) {
      case "boolean":
        return <ClipboardList className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (!savedForms?.length) {
    return (
      <>
        <div className="text-center p-4 text-muted-foreground">
          Ještě jste si nevytvořil žádné formuláře.
        </div>
        {plusButton}
      </>
    );
  }

  return (
    <>
      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="p-4 space-y-2">
          {savedForms.map((form, index) => (
            <div className="group flex items-center">
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => onFormSelect(form, index)}
              >
                {getFormIcon(form)}
                <span className="truncate">{form.formTitle}</span>
                <div className="hidden group-hover:block ml-auto">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={e => {
                      e.stopPropagation();
                      const newForms = savedForms.filter((_, i) => i !== index);
                      setSavedForms(newForms);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      {plusButton}
    </>
  );
}
