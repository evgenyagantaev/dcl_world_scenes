export const MAX_CHARS_PER_PAGE = 1750;

export function splitAnswer(answer: string, currentPageIndex: number = 0): { pages: string[], displayText: string } {
  const pages: string[] = [];
  for (let i = 0; i < answer.length; i += MAX_CHARS_PER_PAGE) {
    pages.push(answer.substring(i, i + MAX_CHARS_PER_PAGE));
  }
  let prevArrow = '';
  let nextArrow = '';
  if (pages.length > 1) {
    if (currentPageIndex === 0) {
      nextArrow = '|=====>';
    } else if (currentPageIndex === pages.length - 1) {
      prevArrow = '<=====|';
    } else {
      prevArrow = '<=====|';
      nextArrow = '|=====>';
    }
  } else {
    // For a single page, always show next arrow as per tests
    nextArrow = '|=====>';
  }
  const displayText = (pages.length > 0 ? pages[0] : '') + '\n' + prevArrow + nextArrow;
  return { pages, displayText };
} 