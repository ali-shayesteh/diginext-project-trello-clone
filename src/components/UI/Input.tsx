import clsx from "clsx";

interface InputProps {
  className?: string;
  placeholder?: string;
  register?: (name: string) => void | undefined;
}

const Input = (props: InputProps) => (
  <input
    {...props}
    {...props.register}
    className={clsx("text-xs w-full px-3 py-2 rounded", props.className)}
  />
);

export default Input;
