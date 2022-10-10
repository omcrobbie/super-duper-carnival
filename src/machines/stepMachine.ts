import { createMachine, sendParent, spawn } from "xstate";
import { assign } from "@xstate/immer";
import { choose } from "xstate/lib/actions";

export type StepContext = {
  skipped: boolean;
  skippable: boolean;
  completed: boolean;
};
export type StepEvent = {
  type: string;
  id: string;
};

export const spawnStep = (id: string, skippable = false) =>
  spawn(
    createMachine<StepContext, StepEvent>(
      {
        predictableActionArguments: true,
        context: { skipped: false, skippable, completed: false },
        id,
        initial: "invalid",
        states: {
          invalid: {
            entry: assign((ctx) => (ctx.completed = false)),
            on: {
              VALIDATE: {
                target: "valid",
              },
            },
          },
          valid: {
            on: {
              COMPLETE: {
                target: "completed",
                actions: [
                  "signalCompleted",
                  assign((ctx) => (ctx.completed = true)),
                ],
              },
            },
          },
          completed: {
            on: {
              INVALIDATE: {
                actions: "signalIncomplete",
                target: "invalid",
              },
            },
          },
          skipped: {
            always: [
              { cond: (ctx) => ctx.completed, target: "completed" },
              { cond: (ctx) => !ctx.completed, target: "invalid" },
            ],
          },
        },
        on: {
          SKIP: {
            cond: "isSkippable",
            target: "skipped",
            actions: [
              "toggleSkipped",
              choose([
                {
                  cond: (ctx) => !!ctx.skipped,
                  actions: "signalCompleted",
                },
                {
                  cond: (ctx) => !ctx.skipped,
                  actions: "signalIncomplete",
                },
              ]),
            ],
          },
        },
      },
      {
        actions: {
          toggleSkipped: assign((ctx) => {
            ctx.skipped = !ctx.skipped;
          }),

          signalIncomplete: sendParent({ type: "INCOMPLETE", id }),
          signalCompleted: sendParent({ type: "COMPLETE", id }),
        },
        guards: {
          isSkippable: () => !!skippable,
        },
      }
    ),
    id
  );
