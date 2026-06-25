import type { JSX } from "solid-js";
import { SolidConvexContext, type SolidConvex } from "./index";

export function SolidConvexProvider(props: {
  convex: SolidConvex;
  children: JSX.Element;
}) {
  return (
    <SolidConvexContext.Provider value={props.convex}>
      {props.children}
    </SolidConvexContext.Provider>
  );
}
