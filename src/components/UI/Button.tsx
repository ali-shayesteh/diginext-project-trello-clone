import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonParams {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "submit";
}
const Button = (props: ButtonParams) => (
  <button
    {...props}
    className={clsx(
      "btn",
      props.className,
      props.type === "submit" && "btn-primary"
    )}
  >
    {props.children}
  </button>
);

export default Button;
