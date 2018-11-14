# brightspace2excel
Download your Brightspace grades to an Excel spreadsheet. No more copying and pasting and checking and re-checking. It's a bit of a Rube Goldberg machine, but it works.

Just fill in your Brightspace username and password in `brightspace.js`.

## Set up

Run `pip -r requirements.txt`

Run `npm install .`

Run `node brightspace.js; python brightspace.py`

After that, you will see a file called `Brightspace_grades.xlsx` in this directory. Open it, and the file will contain your marks for all of your courses, with each course in a seperate workbook.
