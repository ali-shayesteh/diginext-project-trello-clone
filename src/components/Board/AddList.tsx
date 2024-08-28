import { Plus, X } from "lucide-react";
import Button from "../UI/Button";
import { useState } from "react";
import Input from "../UI/Input";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
  title: string;
};
const AddList = () => {
  const { register, handleSubmit } = useForm<FormValues>();

  const [showForm, setShowForm] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log({ data });
  };

  return (
    <>
      {showForm ? (
        <div className="w-72 p-2 bg-[#f1f2f4] rounded-xl shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder="Enter list name" />
            <div className="flex gap-2 mt-3">
              <Button
                type="submit"
                className="!bg-[#0c66e4] hover:!bg-[#0055cc] !w-auto !text-white !rounded !px-3"
              >
                Add card
              </Button>
              <div
                className="btn !w-auto !rounded cursor-pointer"
                onClick={() => setShowForm(false)}
              >
                <X size={24} />
              </div>
            </div>
          </form>
        </div>
      ) : (
        <Button onClick={() => setShowForm(true)}>
          <Plus size={16} /> <span>Add another list</span>
        </Button>
      )}
    </>
  );
};

export default AddList;
