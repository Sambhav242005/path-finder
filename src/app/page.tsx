"use client";

import { Node } from "@/components/Node";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

type NodeWithPaths = {
  isPath: boolean;
  isStart: boolean;
  isFinish: boolean;
  isBlock: Boolean;
  row: number;
  col: number;
};

type Grid = NodeWithPaths[][];

export default function Home() {
  const [nodes, setNodes] = useState<Grid>([]);

  const [select, setSelect] = useState("");
  const [startPoint, setStart] = useState({ row: 10, col: 5 });
  const [finishPoint, setFinish] = useState({ row: 10, col: 45 });
  const [change, setChange] = useState(false);

  const [node, setNode] = useState({ col: 0, row: 0 });

  useEffect(() => {
    if (select == "start") {
      setStart(node);
    } else if (select == "finish") {
      setFinish(node);
    } else if (select == "wall") {
      const newNodes = [] as Grid;
      newNodes.push(...nodes);

      const selectedNode = newNodes[node.row][node.col];
      selectedNode.isBlock = true;

      setNodes(newNodes);
    }
  }, [node]);

  const selectNode = (row: number, col: number) => {
    setNode({ row, col });
  };

  const lastRow = 20;
  const lastCol = 50;

  useEffect(() => {
    const newNodes: Grid = [];
    for (let row = 0; row < lastRow; row++) {
      const currentRow = [];
      for (let col = 0; col < lastCol; col++) {
        const currentNode = {
          col,
          row,
          isPath: false,
          isStart: row === startPoint.row && col === startPoint.col,
          isFinish: row === finishPoint.row && col === finishPoint.col,
          isBlock: false,
        };
        currentRow.push(currentNode);
      }
      newNodes.push(currentRow);
    }
    setNodes(newNodes);
  }, [startPoint, finishPoint, change]);

  function findNearestPoint(
    points: (typeof startPoint)[],
    refPoint: typeof startPoint
  ): { row: number; col: number; distance: number } {
    let nearestPoint: { row: number; col: number; distance: number } = {
      row: 0,
      col: 0,
      distance: Infinity,
    };

    for (const point of points) {
      const distance = distanceBetweenPoints(
        point.row,
        point.col,
        refPoint.row,
        refPoint.col
      );
      if (distance < nearestPoint.distance) {
        nearestPoint = { row: point.row, col: point.col, distance };
      }
    }

    return nearestPoint;
  }

  function distanceBetweenPoints(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function getNearbyPoints(
    start: { row: number; col: number },
    lastRow: number,
    lastCol: number
  ) {
    const { row, col } = start;
    console.log(start);

    const nearbyPoints = [];

    // Check above
    const aboveNode = nodes[row - 1][col];
    if (
      row > 0 &&
      !aboveNode.isBlock &&
      !aboveNode.isPath &&
      !aboveNode.isStart
    ) {
      nearbyPoints.push({ row: row - 1, col });
    }

    // Check below
    const belowNode = nodes[row][col + 1];
    if (
      row < lastRow - 1 &&
      !belowNode.isBlock &&
      !belowNode.isPath &&
      !belowNode.isStart
    ) {
      nearbyPoints.push({ row: row + 1, col });
    }

    // Check left
    const leftNode = nodes[row][col - 1];
    if (col > 0 && !leftNode.isBlock && !leftNode.isPath && !leftNode.isStart) {
      nearbyPoints.push({ row, col: col - 1 });
    }

    // Check right
    const rightNode = nodes[row][col + 1];
    if (
      col < lastCol - 1 &&
      !rightNode.isPath &&
      !rightNode.isBlock &&
      !rightNode.isStart
    ) {
      nearbyPoints.push({ row, col: col + 1 });
    }

    return nearbyPoints;
  }
  const searchShortestPath = () => {
    let isReach = false;
    let tryToReach = 100;
    let point = startPoint;
    let newNodes = [...nodes]; // create a copy of nodes
    let delay = 400; // delay in milliseconds

    while (!isReach && tryToReach > 0) {
      const nearby = getNearbyPoints(point, lastRow, lastCol);
      if (nearby.length > 0) {
        if (
          nearby.some(
            (p) => p.row === finishPoint.row && p.col === finishPoint.col
          )
        ) {
          isReach = true;
          break;
        }
        const { row, col } = findNearestPoint(nearby, finishPoint);
        point = { row, col };
        if (newNodes[row][col]) {
          setTimeout(() => {
            newNodes[row][col].isPath = true;
            setNodes([...newNodes]); // update the state with the new nodes
          }, delay);
          delay += 200; // increase the delay for the next node
        }
      } else {
        alert("Dont reach it");
        break;
      }

      tryToReach--;
    }

    if (!isReach) {
      setTimeout(() => {
        alert("Dont Reach");
      }, delay);
    }
  };
  // Assuming necessary imports and setup are done above

  function findPath() {
    let isReach = false;
    let tryToReach = 100; // Arbitrary number of attempts
    let delay = 0;
    let point = startPoint;
    let newNodes = [] as Grid;

    const updateNodes = (row: number, col: number, delay: number) => {
      setTimeout(() => {
        newNodes[row][col].isPath = true;
        setNodes([...newNodes]); // Correctly creating a new array for the state update
      }, delay);
    };

    while (!isReach && tryToReach > 0) {
      const nearby = getNearbyPoints(point, lastRow, lastCol);
      if (nearby.length > 0) {
        if (
          nearby.some(
            (p) => p.row === finishPoint.row && p.col === finishPoint.col
          )
        ) {
          isReach = true;
          break;
        }
        const { row, col } = findNearestPoint(nearby, finishPoint);
        point = { row, col };
        if (newNodes[row][col]) {
          updateNodes(row, col, delay); // Using a function to handle the timeout logic
          delay += 200; // Increase the delay for the next node
        }
      } else {
        tryToReach = 0;
        break;
      }

      tryToReach--;
    }

    if (!isReach) {
      setTimeout(() => alert("Can't Reach"), delay); // Corrected grammar
    }
  }

  return (
    <>
      <div>
        <div className="p-4 flex gap-5">
          <Select onValueChange={(value) => setSelect(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="start">Start Point</SelectItem>
              <SelectItem value="finish">Finish Point</SelectItem>
              <SelectItem value="wall">Wall</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setChange(!change)}>Restart!</Button>
        </div>
        <div>
          <div className="bg-slate-400 grid gap-0 mx-auto w-fit p-3">
            {nodes.map((row, rowIdx) => {
              return (
                <div key={rowIdx} className="m-0 p-0">
                  {row.map((node, nodeIdx) => {
                    return (
                      <Node key={nodeIdx} onClick={selectNode} node={node} />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <Button
          className={buttonVariants({
            variant: "secondary",
            className: "m-3 w-fit bg-slate-300",
          })}
          onClick={searchShortestPath}
        >
          Start up!
        </Button>
      </div>
    </>
  );
}
