import clsx from "clsx";

interface TextAreaProps {
  className?: string;
  placeholder?: string;
}

const TextArea = (props: TextAreaProps) => (
  <textarea
    {...props}
    className={clsx(
      "shadow text-xs w-full px-3 py-2 rounded-lg resize-none",
      props.className
    )}
  />
);

export default TextArea;
