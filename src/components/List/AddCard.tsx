import { Plus, X } from "lucide-react";
import Button from "../UI/Button";
import { useState } from "react";
import TextArea from "../UI/TextArea";

const AddCard = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      {showForm ? (
        <>
          <TextArea placeholder="Enter a name for this card…" />
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
        </>
      ) : (
        <Button className="bg-transparent" onClick={() => setShowForm(true)}>
          <Plus size={16} /> <span>Add a card</span>
        </Button>
      )}
    </>
  );
};

export default AddCard;
