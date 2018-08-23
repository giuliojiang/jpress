#! /usr/bin/env python3

import os
import sys
import subprocess

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

currDir = os.path.abspath(os.path.dirname(__file__))

def log(s, col=None):
    formattedString = "* test * * * {}".format(s)
    if col is None:
        print(formattedString)
    else:
        print(col + formattedString + bcolors.ENDC)

# List content of current directory
dirContent = os.listdir(currDir)

# Function to process a single javascript test
def processTest(testPath):

    baseName = os.path.basename(testPath)

    log("Starting test file {}".format(baseName))

    code = subprocess.call([
        "node",
        testPath
    ])

    if code != 0:
        log("Test {} failed".format(baseName), bcolors.FAIL)
        sys.exit(1)

for aDirectoryElement in dirContent:

    anElementFullPath = os.path.join(currDir, aDirectoryElement)
    stem, ext = os.path.splitext(anElementFullPath)
    if ext == ".js":
        processTest(anElementFullPath)

log("All tests completed", bcolors.OKGREEN)
sys.exit(0)
