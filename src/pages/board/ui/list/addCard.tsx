import { Plus, X } from "lucide-react";
import Button from "../../../../shared/ui/button";
import { useEffect, useRef, useState } from "react";
import TextArea from "../../../../shared/ui/textArea";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../shared/api/apiService";

type FormValues = {
  title: string;
};
type AddCardType = {
  listId: number;
  boardId: number;
};

const AddCard = ({ listId, boardId }: AddCardType) => {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, resetField, setFocus } =
    useForm<FormValues>();

  const mutation = useMutation({
    mutationFn: (newCard: { title: string; listId: number }) => {
      return axiosInstance.post("/api/cards", newCard);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/boards/" + boardId],
      });

      queryClient.invalidateQueries({
        queryKey: ["lists", listId],
      });
      resetField("title", {
        defaultValue: "",
      });
      setFocus("title");
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const newCard = { ...data, listId };
    mutation.mutate(newCard);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  useEffect(() => {
    if (!showForm) return;
    setFocus("title");
  }, [setFocus, showForm]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <>
      {showForm ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextArea
              ref={textAreaRef}
              register={register("title", { required: true })}
              placeholder="Enter a name for this card…"
            />
            <div className="flex gap-2 mt-3">
              <Button className="!bg-[#0c66e4] hover:!bg-[#0055cc] !w-auto !text-white !rounded !px-3">
                Add card
              </Button>
              <Button
                className="!w-auto !rounded"
                onClick={() => setShowForm(false)}
              >
                <X size={24} />
              </Button>
            </div>
          </form>
        </>
      ) : (
        <Button className="bg-transparent" onClick={handleShowForm}>
          <Plus size={16} /> <span>Add a card</span>
        </Button>
      )}
    </>
  );
};

export default AddCard;
