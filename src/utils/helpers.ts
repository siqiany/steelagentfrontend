export const highlightKeywords = (text: string, keywords: string[]) => {
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi')
    return text.replace(regex, '<span class="highlight">$1</span>')
  }