const puppeteer = require('puppeteer');

(async () => {

    console.log("Launching browser...");
    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://dal.brightspace.com/d2l/login');

    await console.log("Logging in...");
	
	// ATTENTION: replace these values to log in.
    await page.$eval('#userName', el => el.value = 'BRIGHTSPACE_USERNAME');
	await page.$eval('#password', el => el.value = 'BRIGHTSPACE_PASSWORD');
    const formPersonal = await page.$('[primary="primary"]');
    await formPersonal.click()
	await console.log("Clicked submit button. Waiting...")
	
    await page.waitForNavigation();
	await page.waitForNavigation();
	
	await("Finding courses...")
    await page.goto('https://dal.brightspace.com/d2l/lp/courseSelector/1111/InitPartial?_d2l_prc%24headingLevel=1&_d2l_prc%24scope=&_d2l_prc%24hasActiveForm=false&isXhr=true&requestId=2')
    var fs = require('fs');

    await console.log("Parsing courses...")

    const html = await page.content();

    const regex = /\/d2l\/lp\/courseSelector\/PinCourse\?pinOrgUnitId=\d*/gm;
    let m;

    str = html
    brightspaceURLs = []
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match) => {
            brightspaceURLs.push(`https://dal.brightspace.com${match}`.replace("/lp/courseSelector/PinCourse?pinOrgUnitId=", "/lms/grades/my_grades/main.d2l?ou="));
			console.log("Found brightspace course link");
        });
    }

    for (i = 0; i < brightspaceURLs.length; i++) {
	console.log("Preparing URL " + brightspaceURLs[i]);
        await page.goto(brightspaceURLs[i]);

        brightspaceContent = await page.content();

        // https://tutorialedge.net/javascript/nodejs/reading-writing-files-with-nodejs/
        fs.writeFile('brightspace_' + i + '.txt', brightspaceContent, function(err, data) {
            if (err) console.log(err);
        });
    }

	console.log("Done! Preparing Excel spreadsheet...");
    await browser.close();

})();
