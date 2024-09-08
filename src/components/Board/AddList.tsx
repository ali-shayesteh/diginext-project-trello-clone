import { Plus, X } from "lucide-react";
import Button from "../UI/Button";
import { useEffect, useRef, useState } from "react";
import Input from "../UI/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { appAxios } from "../../lib/util";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type FormValues = {
  title: string;
};
type AddListType = {
  boardId: number;
};

const AddList = ({ boardId }: AddListType) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setFocus } = useForm<FormValues>();

  const [showForm, setShowForm] = useState(false);

  const mutation = useMutation({
    mutationFn: (newList: { title: string; boardId: number }) => {
      return appAxios.post("/api/lists", newList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", boardId],
      });
      // setShowForm(false);
      reset();
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const newList = { ...data, boardId, cardsOrder: [] };

    mutation.mutate(newList);
  };

  useEffect(() => {
    if (!showForm) return;
    setFocus("title");
  }, [setFocus, showForm]);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {showForm ? (
        <div className="w-72 p-2 bg-[#f1f2f4] rounded-xl shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              ref={inputRef}
              register={register("title", { required: true })}
              placeholder="Enter list name"
            />
            <div className="flex gap-2 mt-3">
              <Button type="submit">Add card</Button>
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
        <Button className="w-72" onClick={() => setShowForm(true)}>
          <Plus size={16} /> <span>Add another list</span>
        </Button>
      )}
    </>
  );
};

export default AddList;
