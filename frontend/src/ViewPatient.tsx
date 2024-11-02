import { useParams } from "react-router-dom";
import { PageLayout } from "./components/page-layout";
import { Card, CardHeader } from "./components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Accordion, AccordionContent } from "@radix-ui/react-accordion";
import { AccordionItem, AccordionTrigger } from "./components/ui/accordion";

interface PatientReports {
  i_dg_kod: string;
  i_text_dg: string;
  ic_amb_zad: string;
  ic_pac: string;
}

const groupByDiagnosisCode = (reports: PatientReports[]) => {
  return reports.reduce((acc, report) => {
    if (!acc[report.i_dg_kod]) {
      acc[report.i_dg_kod] = [];
    }
    acc[report.i_dg_kod].push(report);
    return acc;
  }, {} as Record<string, PatientReports[]>);
};

export const ViewPatient = () => {
  const { patientId } = useParams();

  const { data, status } = useQuery({
    queryKey: ["autocomplete"],
    initialData: [],
    queryFn: async (): Promise<PatientReports[]> => {
      const data = await fetch(
        `https://api.hjb.mesh.sk/api/query/${patientId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );

      const _data = await data.json();

      return typeof data !== "undefined" ? _data : [];
    },
  });

  const groupedData = React.useMemo(() => groupByDiagnosisCode(data), [data]);

  if (status === "error") {
    return <div>Pacient nenalezen</div>;
  }

  return (
    <PageLayout>
      <Card className="w-full">
        <CardHeader>Pacient {patientId}</CardHeader>
        <Accordion type="single" collapsible className="p-8">
          <h3 className="text-lg">Formuláře</h3>
          {Object.entries(groupedData).map(([diagnosisCode, reports]) => (
            <AccordionItem
              key={diagnosisCode}
              value={`formField-${diagnosisCode}`}
            >
              <AccordionTrigger>
                {diagnosisCode} - {reports[0]?.i_text_dg}
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ic_amd_zad</TableHead>
                      <TableHead className="w-[100px]">ic_dg_kod</TableHead>
                      <TableHead className="w-[100px]">i_txt_dg</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports?.map(row => (
                      <TableRow
                        key={row.ic_amb_zad}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell className="font-medium">
                          {row.ic_amb_zad}
                        </TableCell>
                        <TableCell className="font-medium">
                          {row.i_dg_kod}
                        </TableCell>
                        <TableCell className="font-medium">
                          {row.i_text_dg}
                        </TableCell>
                        {/* <TableCell>
                                        <Button variant="outline" onClick={() => navigate(`/patient/${row}`)}>Otevřít <SquareArrowOutUpRight /></Button>
                                    </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </PageLayout>
  );
};
