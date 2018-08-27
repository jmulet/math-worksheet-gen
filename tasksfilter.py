#!/usr/bin/env python

"""
Pandoc filter to convert all level 2+ headers to paragraphs with
emphasized text.
"""

from pandocfilters import toJSONFilter, OrderedList

def tasks(key, value, format, meta):
  if key == 'Header' and value[0] >= 2:
     if key == 'RawBlock':
        [fmt, code] = value
        if fmt == "latex" and re.match("\\\\begin{tasks}", code):             
            return OrderedList()
        elif fmt == "latex" and re.match("\\\\task", code):             
            return Para()
if __name__ == "__main__":
  toJSONFilter(tasks)