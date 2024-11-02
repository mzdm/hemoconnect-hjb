import { useParams } from "react-router-dom"
import { PageLayout } from "./components/page-layout"
import { Card, CardHeader } from "./components/ui/card"

export const ViewPatient = () => {
    const { patientId } = useParams()

    console.log(patientId)

    return (
        <PageLayout>
            <Card className="w-3/6">
                <CardHeader>
                    Pacient {patientId}
                </CardHeader>
            </Card>
        </PageLayout>
    )
}