# A pre-process program to clean up the data from a movie script
# Iron Man
# Written by Yuli Cai, 2018
# For project and workshop Word Land

import sys

# An array to hold the processed script
cleaned_script=[]

# Use file system to open the text file 
file1 = open("iron_man_script.txt")
# readlines(), read all lines in a file
lines = file1.readlines()
file1.close()

for line in lines:
	# lines with only white spaces
	if not line.strip():
		continue
	else:
		cleaned_script.append(line)

# in Terminal, use command line: python preprocess_iron_man.py >iron_man_script_cleaned.txt
print "".join(cleaned_script)
