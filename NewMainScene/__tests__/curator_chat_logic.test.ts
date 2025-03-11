import { MAX_CHARS_PER_PAGE, splitAnswer } from '../src/curator_chat_logic';

describe('splitAnswer', () => {
  test('should return one page if answer length is less than MAX_CHARS_PER_PAGE', () => {
    const answer = 'Hello World';
    const { pages, displayText } = splitAnswer(answer);
    expect(pages.length).toBe(1);
    expect(pages[0]).toBe(answer);
    expect(displayText).toBe(answer + '\n' + '|=====>');
  });

  test('should split answer into multiple pages if longer than MAX_CHARS_PER_PAGE', () => {
    const answer = 'a'.repeat(MAX_CHARS_PER_PAGE + 10);
    const { pages, displayText } = splitAnswer(answer);
    expect(pages.length).toBe(2);
    expect(pages[0].length).toBe(MAX_CHARS_PER_PAGE);
    expect(pages[1].length).toBe(10);
    // For first page, as currentPageIndex is 0 and there are two pages,
    // displayText should end with '|=====>' and no previous page arrow.
    expect(displayText).toBe(pages[0] + '\n' + '|=====>');
  });

  test('should include previous arrow when currentPageIndex > 0', () => {
    const answer = 'a'.repeat(MAX_CHARS_PER_PAGE * 2);
    const { pages, displayText } = splitAnswer(answer, 1);
    // For currentPageIndex = 1, previous arrow should be present and no next arrow if last page
    expect(displayText).toBe(pages[0] + '\n' + '<=====|');
  });
}); 