import { useState } from "react";
import FormSelect from "./components/form-select";
import EnhancedSearchForm from "./components/enhanced-search-form";
import { Card, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import { FormSchema } from "./hooks/form-schema";
import { PageLayout } from "./components/page-layout";

const isValidIndex = (index: number | undefined | null): index is number =>
    Number.isInteger(index) && typeof index === "number" && index >= 0;

export function Schemes() {
    const [selectedForm, setSelectForm] = useState<FormSchema>();
    const [selectedIndex, setSelectIndex] = useState<number>();

    return (
        <PageLayout>
        {!selectedForm && (
        <>
          <h3 className="text-lg">Šablony</h3>
          <p className="text-md text-gray-500 w-3/6">
            Šablony poskytují umělé inteligenci pokyny pro zpracování zpráv z nemocničního informačního systému (NIS).
            <br />Následně slouží k snadnému zpracovávání, a ukládání dat do registrů.
          </p>
          <div className="h-4" />
          <div>
            <FormSelect
              onFormSelect={(schema, index) => {
                setSelectForm(schema);
                setSelectIndex(index);
              } } 
            />
          </div>
        </>
      )}
      {selectedForm && isValidIndex(selectedIndex) && (
        <Card className="w-full max-w-3xl mx-auto p-4">
        {selectedForm && (
          <button
            onClick={() => setSelectForm(undefined)}
            className="p-2 mt-4 ml-4 text-gray-600 hover:text-gray-900"
          >
            ← Zpět
          </button>
        )}
        <CardHeader>
          <CardTitle>{selectedForm.formTitle}</CardTitle>
          <CardDescription>ID: {selectedForm.uuid}</CardDescription>
        </CardHeader>
        <EnhancedSearchForm
          initialFormState={selectedForm}
          index={selectedIndex}
        />
        </Card>

      )}
      </PageLayout>
    )
}