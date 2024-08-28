import { createContext, useState } from "react";
import {
  BoardDataInterface,
  DataContextInterface,
  ListInterface,
} from "../types/types";

const initialData: ListInterface[] = [
  {
    id: 1,
    name: "list 1",
  },
  {
    id: 2,
    name: "list 2",
  },
];

export const DataContext = createContext<DataContextInterface | undefined>(
  undefined
);

const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<ListInterface[] | undefined>(initialData);

  //   const setData = ( value: T) => {
  //     setInternalData((prevData) => [...prevData, value])
  //   }

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
