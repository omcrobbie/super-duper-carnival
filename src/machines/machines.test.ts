import { createPage } from "./pageMachine";
import { interpret } from "xstate";

describe("createPage", () => {
  it("should transition to default state", () => {
    const service = interpret(createPage("page1")).onChange(({ steps }) => {
      expect(steps).toHaveLength(2);
    });
    service.start();
  });
  it("should update step to complete then incomplete", () => {
    const service = interpret(createPage("page1")).start();
    const stepService = service.children.get("step1");
    stepService?.send({ type: "VALIDATE" });
    stepService?.send({ type: "COMPLETE" });
    expect(service.getSnapshot().context.completedSteps).toContain("step1");
    stepService?.send({ type: "SKIP" });
    expect(stepService.getSnapshot().context.skipped).toBeTruthy();
    stepService?.send({ type: "SKIP" });
    expect(service.getSnapshot().context.completedSteps).not.toContain("step1");
    expect(stepService.state.value).toBe("completed");
  });
  it("should complete a step via SKIP", () => {
    const service = interpret(createPage("page1")).start();
    const stepService = service.children.get("step1");
    stepService?.send({ type: "SKIP" });
    expect(stepService?.getSnapshot().context.skipped).toBe(true);
    expect(stepService?.state.matches("invalid")).toBeTruthy();
    expect(service.getSnapshot().context.completedSteps).toContain("step1");
  });
  it("should complete page", () => {
    const service = interpret(createPage("page1")).start();
    expect(service.state.context.pageComplete).toBe(false);
    const stepService = service.children.get("step1");
    const step2Service = service.children.get("step2");
    stepService?.send({ type: "VALIDATE" });
    stepService?.send({ type: "COMPLETE" });
    step2Service?.send({ type: "VALIDATE" });
    step2Service?.send({ type: "COMPLETE" });
    expect(service.state.context.pageComplete).toBe(true);
    step2Service?.send({ type: "INVALIDATE" });
    console.log(service.state.context.completedSteps);
    expect(service.state.context.pageComplete).toBe(false);
  });
});
