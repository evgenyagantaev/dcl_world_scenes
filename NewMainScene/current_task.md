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

### Part 1: Writing/Modifying Unit Tests



### Part 2: Implementing Code Changes



### Part 3: Final Testing




