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

в файле src/calendar_interactive_en.html содержится приложение календаря;
прочитай и проанализируй этот файл;
создай в пространстве сцены 3д объект на поверхности которого должна отображаться информация о текущем месяце;
текущая дата должна рассчитываться динамически по алгоритму, реализованному в скриптовой части calendar_interactive_en.html;

## Implementation Plan

- [ ] Run all initial unit tests and record results (not all tests may pass).

### Part 1: Writing/Modifying Unit Tests
- [ ] Write tests to verify the creation of a 3D object in the scene.
- [ ] Write tests to verify that the object's surface displays correct current month information calculated dynamically.

### Part 2: Implementing Code Changes
- [ ] Analyze the algorithm in src/calendar_interactive_en.html for computing the current date.
- [ ] Implement a 3D object in the scene space with its surface displaying the current month, using the dynamic algorithm.
- [ ] Integrate the new functionality with the existing calendar app.

### Part 3: Final Testing
- [ ] Run all unit tests again to verify all tests pass.



