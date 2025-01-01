// COPY AND MODIFIED from https://github.com/aklinker1/webext-core

/**
 * Class for parsing and performing operations on match patterns.
 *
 * @example
 * const pattern = new MatchPattern("*://google.com/*");
 *
 * pattern.includes("https://google.com");            // true
 * pattern.includes("http://youtube.com/watch?v=123") // false
 */
export class MatchPattern {
  private regex?: RegExp;
  constructor(matchPattern: string) {
    this.regex = this.patternToRegex(matchPattern)
  }

  patternToRegex(p: string): RegExp {
    p = escapeRegex(p)
    p = p.replaceAll("\\*", ".*")
    return new RegExp("^" + p + "$")
  }

  /**
   * Check if a URL is included in a pattern.
   */
  includes(url: string): boolean {
    return this.regex!.test(url)
  }
}


function escapeRegex(s: string) {
  return s.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}
