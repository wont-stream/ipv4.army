import "./index.css";
import { X } from "lucide-preact";
import type { ReactNode } from "react";

export const Popover = (props: {
  id: string;
  title: string;
  body: ReactNode;
}) => {
  const handleClose = () => {
    const el = document.getElementById(props.id) as HTMLDivElement;
    el?.hidePopover?.();
  };

  return (
    <div popover class="popover" id={props.id}>
      <div class="header">
        <span>{props.title}</span>
        <button onClick={handleClose} type="button" aria-label="Close popover">
          <X />
        </button>
      </div>
      <div class="body center">{props.body}</div>
    </div>
  );
};
