import { useState } from "react";
import EnhancedSearchForm, {
  FormSchema,
} from "./components/enhanced-search-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./components/ui/card";
import FormSelect from "@/components/form-select";

const isValidIndex = (index: number | undefined | null): index is number =>
  Number.isInteger(index) && typeof index === "number" && index >= 0;

function App() {
  const [selectedForm, setSelectForm] = useState<FormSchema>();
  const [selectedIndex, setSelectIndex] = useState<number>();

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-3xl mx-auto p-4">
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
        {!selectedForm || !isValidIndex(selectedIndex) ? (
          <FormSelect
            onFormSelect={(schema, index) => {
              setSelectForm(schema);
              setSelectIndex(index);
            }}
          ></FormSelect>
        ) : (
          <EnhancedSearchForm
            initialFormState={selectedForm}
            index={selectedIndex}
          />
        )}
      </Card>
    </div>
  );
}

export default App;
