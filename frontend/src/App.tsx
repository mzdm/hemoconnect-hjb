import { SquareArrowOutUpRight, User } from "lucide-react";
import { PageLayout } from "./components/page-layout";
import { Button } from "./components/ui/button";
import { Card, CardHeader } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";

const patients: Array<{ id: string }> = [{
  id: "2135408"
}, {
  id: "719181"
}, {
  id: "257353"
}]

function App() {


  return (
    <PageLayout>
      <h3 className="text-lg">Pacienti</h3>
      <Input placeholder="Začněte psát IC pacienta" />
      <div className="h-4" />
      <div className="flex items-center justify-start w-full">
        <Card className="w-3/6">
          <CardHeader>
            Vyhledávání pacientů
          </CardHeader>
          <Table>
        <TableHeader>
          <TableRow>
          <TableHead className="w-[40px]"></TableHead>
            <TableHead className="w-[100px]">ic pacienta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell><User size={16} /></TableCell>
              <TableCell className="font-medium">{patient.id}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => console.error("not implemented")}>Otevřít <SquareArrowOutUpRight /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        </Card>
      </div>
    </PageLayout>
  );
}

export default App;
