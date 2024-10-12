import clsx from "clsx";
import { forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  className?: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
}

type RefProps = HTMLTextAreaElement;

const TextArea = forwardRef<RefProps, TextAreaProps>((props, ref) => {
  const { register, className, ...restProps } = props;
  return (
    <textarea
      ref={ref}
      {...restProps}
      {...register}
      className={clsx(
        "shadow text-xs w-full px-3 py-2 rounded-lg resize-none",
        className
      )}
    />
  );
});

export default TextArea;
