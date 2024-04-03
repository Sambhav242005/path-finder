// @flow
import { cn } from "@/lib/utils";
import * as React from "react";
import { Button } from "./ui/button";
type Props = {
  isStart: boolean;
  isFinish: boolean;
  isPath: Boolean;
  isBlock: Boolean;
  row: number;
  col: number;
  onClick: (row: number, col: number) => void;
};
export const Node = (props: Props) => {
  const { isStart, isFinish, isBlock, isPath, onClick, row, col } = props;
  return (
    <Button
      onClick={() => {
        onClick(row, col);
      }}
      className={cn(
        "w-6 h-6 outline-1 outline-gray-700 inline-block border p-0 m-0",
        {
          "bg-green-700": isStart,
          "bg-red-700": isFinish,
          "bg-stone-700": isBlock,
          "bg-blue-800 animate-accordion-up ": isPath,
        }
      )}
    ></Button>
  );
};
