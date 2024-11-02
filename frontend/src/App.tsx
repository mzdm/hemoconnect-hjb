import { PageLayout } from "./components/page-layout";
import { Card, CardHeader } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Table, TableCaption } from "./components/ui/table";

function App() {


  return (
    <PageLayout>
      <h3 className="text-lg">Pacienti</h3>
      <Input placeholder="Začněte psát ID pacienta" />
      <div className="h-4" />
      <div className="flex items-center justify-start w-full">
        <Card className="w-3/6">
          <CardHeader>
            Vyhledávání pacientů
          </CardHeader>
          <Table>
            <TableCaption>Vyhledaný pacienti</TableCaption>
          </Table>
        </Card>
      </div>
    </PageLayout>
  );
}

export default App;
