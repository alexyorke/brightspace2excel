from bs4 import BeautifulSoup
from prettytable import PrettyTable

# https://xlsxwriter.readthedocs.io/tutorial01.html
import xlsxwriter
workbook = xlsxwriter.Workbook('Brightspace_grades.xlsx')
rowCounter = 0
html_doc = ""

# Change this to the number of courses that you have
NUM_COURSES = 5

i = 0
while (i < NUM_COURSES):
    rowCounter = 0
    with open('brightspace_' + str(i) + '.txt', 'r') as myfile:
        html_doc = myfile.read().replace('\n', '')
    soup = BeautifulSoup(html_doc, 'html.parser')

    print("Grades for " + soup.title.text)
    t = PrettyTable(['Assignment', 'Grade'])
    worksheet = workbook.add_worksheet(soup.title.text[0:31])
    anItem = soup.find("form")

    brightspaceDict = {}
    oldKey = ""
    flag = False

    for anGradeItem in (anItem.find_all("label")):
            if (anGradeItem.get("id") is not None):
                brightspaceDict[oldKey].append(anGradeItem.text)
            else:
                brightspaceDict[anGradeItem.text] = []
                oldKey = anGradeItem.text

    for itemGrade in sorted(brightspaceDict.iterkeys()):
        try:
            assignName = itemGrade
            grade = brightspaceDict[itemGrade][0].replace(" ", "")
            t.add_row([assignName, grade])

            assignName = assignName.encode("ascii")
            grade = grade.encode("ascii")
            worksheet.write(rowCounter, 0, assignName)
            worksheet.write(rowCounter, 1, grade)
            rowCounter = rowCounter + 1
        except IndexError:
            pass
    i = i + 1
    print(t)
    print()

workbook.close()
