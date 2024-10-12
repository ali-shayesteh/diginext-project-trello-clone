import clsx from "clsx";
import { forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  className?: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
}

type RefProps = HTMLInputElement;

const Input = forwardRef<RefProps, InputProps>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      {...props.register}
      className={clsx("text-xs w-full px-3 py-2 rounded", props.className)}
    />
  );
});

export default Input;
