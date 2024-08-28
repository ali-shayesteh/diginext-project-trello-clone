import BoardMain from "./components/Board/BoardMain";
import DataProvider from "./context/DataContext";
import "./App.css";

function App() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <DataProvider>
        <BoardMain />
      </DataProvider>
    </main>
  );
}

export default App;
