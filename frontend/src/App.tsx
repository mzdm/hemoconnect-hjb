import { PageLayout } from "./components/page-layout";
import { Input } from "./components/ui/input";

function App() {


  return (
    <PageLayout>
      <h3 className="text-lg">Pacienti</h3>
      <Input placeholder="Začněte psát ID pacienta" />
    </PageLayout>
  );
}

export default App;
