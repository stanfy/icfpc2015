import sys
import re

word = sys.argv[1]
word = word.lower()
print "checking word " + word

pattern = re.compile("^([p03bcefy2aghij4lmno5dqrvz1kstuwx\s.'!]*)$")

if (pattern.match(word)):
	print "goood word"
else:
	print "baaaad word"