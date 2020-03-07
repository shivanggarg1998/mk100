const {google} = require('googleapis');
const path = require('path');

async function runSample() {
    // Create a new JWT client using the key file downloaded from the Google Developer Console
    const client = await google.auth.getClient({
        keyFile: path.join(__dirname, 'e-commerce-60b22c41898a.json'),
        scopes: 'https://www.googleapis.com/auth/analytics.readonly',
    });

    // Obtain a new drive client, making sure you pass along the auth client
    const analyticsreporting = google.analyticsreporting({
        version: 'v4',
        auth: client,
    });

    const res = await analyticsreporting.reports.batchGet({
        requestBody: {
            "reportRequests": [
                {
                    "viewId": "182993290",
                    "dateRanges": [
                        {
                            "startDate": "2018-10-01",
                            "endDate": "2018-10-07"
                        }
                    ],
                    "metrics": [
                        {
                            "expression": "ga:users",
                            "alias": ""
                        }
                    ],
                    "dimensions": [
                        {
                            "name": "ga:date"
                        }
                    ]
                }
            ]
        }
    });
    // console.log(res.data);
    return res.data;
}

runSample().then(data => {
    console.log(JSON.stringify(data , null , 4));
});