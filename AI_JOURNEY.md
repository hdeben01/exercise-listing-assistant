### AI Assistants Used in This Project
- **Gemini Flash 3.8:** General assistance with backend implementation, architecture ideas, and coding.
- **Claude Sonnet 5:** Specific UI prompts and frontend styling that Gemini was unable to resolve.

### Prompts That Unlocked Something
- The model suddenly started answering in Spanish and I didn't know why. I copy-pasted the system prompt and asked the AI why this was happening; it pointed out that mentioning "Wallapop" in the system prompt caused the model to infer Spanish. Adding a direct constraint fixed it.
- I was debating how to handle the mock mode. At first, I planned to use premade example inputs on the frontend where the user would select an option, send it to the backend, and have the mockProvider look it up in a map. However, that would make custom inputs impossible to test from a reviewer's perspective because it replaced the free-text input with a `<select>`. I consulted the AI, and it suggested keeping the text input while adding recommended example prompt buttons for testing specific scenarios (e.g., malformed output). If the input doesn't match a key in the mock map, it returns a random model output (including intentional errors).
- The AI was very helpful for writing tests—specifically discovering edge cases, speeding up test boilerplate, and catching syntax mistakes.
- Final Auditing of the whole application using a skill created for this task only. The skill was focused on finding critical bugs or logic mistakes, not improving or adding features.

### A Time the AI Got It Wrong, and How I Spotted It
- When scaffolding the UI, the AI over-engineered the frontend by adding unnecessary complexity and poor component structure. I had to reject the generated layout and iterate through multiple prompts and manual tweaking to achieve a clean, functional design.
- The AI suggested tracking and converting the price currency. While not technically wrong, I considered it overkill for this demo and deliberately left it out to keep things simple.

### Anything in the Codebase I Do Not Fully Understand
- Some of the generated CSS code in the assistant component, I heavily relied on AI for this specific part of the code.
- Frontend testing with asynchronous services: I read in the Angular documentation that using `HttpTestingController` is recommended, but I was not deeply familiar with this approach. I implemented it with the help of AI, but I am not 100% confident in all the underlying mechanics.

### What I Would Fix With Another Four Hours
- **Testing:** Currently, backend testing covers the `modelResponseValidator` (which encapsulates domain logic), the `MockProvider`, and basic end-to-end tests for the main application flows. It does not provide full coverag. Additional tests should be written for request description validation and `GeminiProvider`. On the frontend, only the assistant component is tested using a mocked HTTP service. While this validates UI behavior, it doesn't guarantee the entire application works together, so I would add proper integration and E2E tests.
- **Model Behavior & Prompt Tuning:** The system prompt was generated with the help of AI, but its real-world performance is unverified. I would spend time evaluating different system prompts and recommendation formats to see which ones produce higher quality suggestions and translate to better product placement.
- **Session & History Persistence:** Adding session management and persisting prompt/result history would significantly improve the overall user experience.