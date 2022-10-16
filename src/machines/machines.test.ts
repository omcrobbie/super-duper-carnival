import { createPage } from "./pageMachine";
import { interpret } from "xstate";
import { createChild } from "./stepMachine";

const steps = [
	createChild("step1", "why?", "binary", true),
	createChild("step2", "why?", "binary"),
];
describe("createPage", () => {
	it("should transition to default state", () => {
		const service = interpret(createPage("page1", steps)).onChange(
			({ steps }) => {
				expect(steps).toHaveLength(2);
			}
		);
		service.start();
	});
	it("should update step to complete then incomplete", () => {
		const service = interpret(createPage("page1", steps)).start();
		const stepService = service.children.get("step1")! as any;
		stepService?.send({ type: "VALIDATE" });
		stepService?.send({ type: "COMPLETE" });
		expect(service.getSnapshot().context.completedSteps).toContain("step1");
		stepService?.send({ type: "SKIP" });
		expect(stepService!.getSnapshot().context.skipped).toBeTruthy();
		stepService?.send({ type: "SKIP" });
		expect(service.getSnapshot().context.completedSteps).not.toContain("step1");
		expect(stepService.state.value).toBe("completed");
	});
	it("should complete a step via SKIP", () => {
		const service = interpret(createPage("page1", steps)).start();
		const stepService = service.children.get("step1") as any;
		stepService?.send({ type: "SKIP" });
		expect(stepService?.getSnapshot().context.skipped).toBe(true);
		expect(stepService?.state.matches("invalid")).toBeTruthy();
		expect(service.getSnapshot().context.completedSteps).toContain("step1");
	});
	it("should complete page", () => {
		const service = interpret(createPage("page1", steps)).start();
		expect(service.state.context.pageComplete).toBe(false);
		const stepService = service.children.get("step1");
		const step2Service = service.children.get("step2");
		stepService?.send({ type: "VALIDATE" });
		stepService?.send({ type: "COMPLETE" });
		step2Service?.send({ type: "VALIDATE" });
		step2Service?.send({ type: "COMPLETE" });
		expect(service.state.context.pageComplete).toBe(true);
		step2Service?.send({ type: "INVALIDATE" });
		expect(service.state.context.pageComplete).toBe(false);
	});
});
