import {
  Search,
  SlidersHorizontal,
  SquareArrowOutUpRight,
  User,
} from "lucide-react";
import React, { KeyboardEvent } from "react";
import { PageLayout } from "./components/page-layout";
import { Button } from "./components/ui/button";
import { Card, CardHeader } from "./components/ui/card";
import { Input } from "./components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { useNavigate } from "react-router-dom";

function App() {
  const searchRef = React.useRef("");

  const { data, refetch: refetchAutocomplete } = useQuery({
    queryKey: ["autocomplete"],
    initialData: [],
    queryFn: async (): Promise<string[]> => {
      const data = await fetch(`${import.meta.env.VITE_API_URL}/query`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ patientId: searchRef.current }),
      });

      const _data = await data.json();

      return typeof data !== "undefined" ? _data : [];
    },
  });

  const debounced = useDebouncedCallback(
    async () => {
      refetchAutocomplete();
    },
    250,
    {}
  );

  const navigate = useNavigate();

  return (
    <PageLayout>
      <h3 className="text-lg">Pacienti</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Začněte psát IC pacienta"
          onKeyDown={(
            e: KeyboardEvent<HTMLInputElement> & { target: { value: string } }
          ) => {
            searchRef.current = e.target.value;

            if (e.key === "Enter") {
              refetchAutocomplete();
              return;
            }

            debounced();
          }}
        />
        <Button variant="outline" onClick={() => refetchAutocomplete()}>
          <Search />
        </Button>
      </div>
      <div className="h-4" />
      <div className="flex items-start justify-start w-full gap-4">
        <Card className="w-3/6">
          <CardHeader className="flex justify-between items-center w-full flex-row">
            <span>Vyhledávání pacientů</span>
            <Button
              className="flex items-center justify-center"
              variant="outline"
            >
              <SlidersHorizontal />
            </Button>
          </CardHeader>
          {data?.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="w-[100px]">ic pacienta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.slice(0, 10).map(patientId => (
                  <TableRow key={patientId}>
                    <TableCell>
                      <User size={16} />
                    </TableCell>
                    <TableCell className="font-medium">{patientId}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/patient/${patientId}`)}
                      >
                        Otevřít <SquareArrowOutUpRight />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
        <Card className="w-3/6">
          <CardHeader className="flex justify-between items-center w-full flex-row">
            <span>Statistiky</span>
            <Button
              className="flex items-center justify-center"
              variant="outline"
            >
              <SlidersHorizontal />
            </Button>
          </CardHeader>
        </Card>
      </div>
    </PageLayout>
  );
}

export default App;
