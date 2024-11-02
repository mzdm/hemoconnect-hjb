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
          <h3 className="text-lg">Formuláře</h3>
          <FormSelect
            onFormSelect={(schema, index) => {
              setSelectForm(schema);
              setSelectIndex(index);
            } } 
          />
        </>
      )}
      {selectedForm && isValidIndex(selectedIndex) && (
        <Card className="w-full max-w-3xl mx-auto p-4 ">
        {selectedForm && (
          <button
            onClick={() => setSelectForm(undefined)}
            className="p-2 mt-4 ml-4 text-gray-600 hover:text-gray-900"
          >
            ← Zpátky
          </button>
        )}
        <CardHeader>
          <CardTitle>EMIS</CardTitle>
          <CardDescription>Enhanced Medical Information Search</CardDescription>
        </CardHeader>
        <EnhancedSearchForm
          initialFormState={selectedForm}
          index={selectedIndex}
        />
        </Card>

      )}
      {/* {!selectedForm && (
        <>
          <div className="h-4" />
          <h2>Políčka</h2>
          <FormSelect
            onFormSelect={(schema, index) => {
              setSelectForm(schema);
              setSelectIndex(index);
            } } 
          />
        </>
      )} */}
      </PageLayout>
    )
}