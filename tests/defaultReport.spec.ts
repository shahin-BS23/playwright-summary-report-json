import { expect, test } from '@playwright/test';
import DefaultReport from '../src/defaultReport';
import fs from 'fs';

const testStats = {
  testsInSuite: 0,
  totalTestsRun: 0,
  expectedResults: 0,
  unexpectedResults: 0,
  flakyTests: 0,
  testMarkedSkipped: 0,
  failureFree: true,
  durationCPU: 0,
  durationSuite: 0,
  avgTestDuration: 0,
  formattedDurationSuite: '00:00 (mm:ss)',
  formattedAvgTestDuration: '00:01 (mm:ss)',
  failures: {},
  workers: 1,
};

const defaultString ={"Total Tests in Suite": 0,
"Total Tests Completed": 0,
"Tests Passed": 0,
"Tests Failed": 0,
"Flaky Tests": 0,
"Test Skipped": 0,
"Test run was failure free?": true,
"Duration of CPU usage in ms": 0,
"Duration of entire test run in ms": 0,
"Average Test Duration in ms": 0,
"Test Suite Duration": "00:00 (mm:ss)",
"Average Test Duration": "00:01 (mm:ss)",
"Number of workers used for test run": 1

}

test.describe('default report format', () => {
  test('initial stats', () => {

const jsonData = JSON.stringify(defaultString, null, 2);

// Write JSON data to a file
// fs.writeFile('output.json', jsonData, 'utf8', err => {
//   if (err) {
//     console.error('Error writing JSON file:', err);
//   } else {
//     console.log('JSON file has been created.');
//   }

// });

     const report = new DefaultReport(testStats);
     const reportResult = report.templateReport();

  //    fs.writeFile('output2.json', reportResult, 'utf8', err => {
  //     if (err) {
  //       console.error('Error writing JSON file:', err);
  //     } else {
  //       console.log('JSON file has been created.');
  //     }
  //   expect(report.templateReport()).toEqual(jsonData);
    
  // });

  expect(reportResult).toEqual(jsonData);
  
  

 });

});
