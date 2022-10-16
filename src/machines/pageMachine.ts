import { createMachine, spawn } from "xstate";
import { createChild, StepEvent } from "./stepMachine";
import { assign } from "@xstate/immer";

export type PageContext = {
  steps: any[];
  completedSteps: string[];
  pageComplete: boolean;
};

export const createPage = (
  id: string,
  steps: ReturnType<typeof createChild>[]
) =>
  createMachine<PageContext, StepEvent>({
    predictableActionArguments: true,
    context: { steps: [], completedSteps: [], pageComplete: false },
    id,
    initial: "loading",
    states: {
      loading: {
        entry: assign((ctx: PageContext) => {
          ctx.steps = steps.map((s) => spawn(s, s.config.id));
        }),
        always: {
          cond: ({ steps }) => !!steps.length,
          target: "loaded",
        },
      },
      loaded: {
        on: {
          COMPLETE: {
            actions: assign((ctx, e) => {
              ctx.completedSteps.push(e.id);
              ctx.pageComplete = ctx.completedSteps.length === ctx.steps.length;
            }),
          },
          INCOMPLETE: {
            actions: assign((ctx, e) => {
              ctx.completedSteps = ctx.completedSteps.filter((n) => n !== e.id);
              ctx.pageComplete = ctx.completedSteps.length === ctx.steps.length;
            }),
          },
        },
      },
    },
  });
