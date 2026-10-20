import { rmSync } from "node:fs";

// Allure never clears its results folder, so remove the previous run's results.
export default function globalSetup(): void {
    rmSync("allure-results", { recursive: true, force: true });
}
