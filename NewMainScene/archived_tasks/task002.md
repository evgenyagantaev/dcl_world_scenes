# Current task implementation manifest

Внимательно прочитай спецификацию задачи;
составь план выполнения задачи и помести его в этот файл;
пункты плана должны поддерживать возможность отметки об исполнении;
первым пунктом плана всегда должен быть прогон всех юнит-тестов с фиксацией результата 
(не все тесты обязательно должны проходить);
при выполнении задачи нужно строго придерживаться методологии TDD;
прежде чем модифицировать существующий и/или добавлять новый код, 
нужно написать все необходимые тесты на этот модифицируемый или новый код;
при модификации существующего кода, следует сначала модифицировать имеющиеся тесты, 
относящиеся к этому коду, с учетом его планируемых изменений;
последним пунктом плана всегда должен быть прогон всех юнит-тестов;
этот пункт считается завершённым только когда все тесты проходят;
план должен состоять из трёх частей:
первая часть - написание/модификация всех необходимых юнит-тестов
вторая часть - написание кода, который полностью совсместим с уже имеющимися юнит-тестами;
третья часть - контрольный прогон всех юнит-тестов с новым кодом;
после того, как план создан приступай к его последовательному исполнению, отмечая выполненные пункты в этом файле;

## Task specification

- Set up a proper React testing environment with tools like React Testing Library or Enzyme to test the UI components
- Consider using more dependency injection to make the code more testable
- Refactor the code to separate business logic from UI and engine-specific code to improve testability

- React components (`curator_chat_ui.tsx` and `guest_book_ui.tsx`) require specialized React testing utilities and are challenging to test without a proper React testing environment
- The engine systems in `npcController.ts` and `timerUtils.ts` are difficult to test fully due to their integration with the Decentraland engine
- Some parts of the code rely on external systems like WebSockets and the Decentraland engine, which makes them challenging to test in isolation

## Implementation Plan

- [x] Run all unit tests initially and record the results (initial test run; not all tests are required to pass).

### Part 1: Writing/Modifying Unit Tests
- [x] Set up a proper React testing environment using tools like React Testing Library or Enzyme for the UI components.
- [x] Write unit tests for React components (curator_chat_ui.tsx and guest_book_ui.tsx), including rendering, interaction, and snapshot tests.
- [x] Write unit tests for engine systems (npcController.ts and timerUtils.ts) using mocks or stubs for external dependencies.
- [x] Write tests to verify proper dependency injection and separation of business logic from UI/engine-specific code.

### Part 2: Implementing Code Changes
- [x] Refactor the code to implement dependency injection where applicable.
- [x] Separate business logic from UI and engine-specific code to improve testability.
- [x] Modify or add new code ensuring full compatibility with the existing and new unit tests.

### Part 3: Final Testing
- [x] Run all unit tests again and verify that all tests pass (this is the final test run).


