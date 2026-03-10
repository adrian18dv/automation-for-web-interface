# Automated Tests for Web Interface Applications

This repository contains a simple, fast and scalable automation framework implementation for testing web applications. 
Built with [Playwright](https://playwright.dev/), it provides cross‑browser testing capabilities and seamless integration with GitHub Actions for continuous validation. 
Whether you're pushing a small bug fix or a major feature, this suite helps you detect unintended consequences before they reach your users.

## Features

- **Cross‑Browser Testing** – Native support for Chromium, Firefox, and WebKit. Run tests on all engines or select just one.
- **CI/CD Integration** – GitHub Actions workflows automatically trigger tests on `push` and `pull_request` to the main branch.
- **On‑Demand Execution** – Use `workflow_dispatch` to manually run tests with custom parameters (e.g., specific browsers or test suites).
- **Test Suite Selection** – Organise tests by areas (e.g., smoke, regression, login, checkout) and run only what you need.
- **Parallel Execution** – Playwright runs tests in parallel by default, reducing feedback time.
- **Detailed Reporting** – Generate HTML, JSON, JUnit/XML reports and traces to simplify debugging.
- **Early Regression Detection** – Catch unexpected side‑effects of even the smallest code changes.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Git](https://git-scm.com/)
