#! /usr/bin/env node
/*
 * marionette-git
 * https://github.com/chsien/marionette-git
 *
 * Copyright (c) 2013 Jason Lee
 * Licensed under the MIT license.
 */

var file = null;

// print process.argv
process.argv.forEach(function (val, index, array) {
  switch(index) {
  	case 2:
      file = val;
      break;
  	default:
  	  break;
  }
});

var gitlog = require('gitlog'),
	execSync = require('exec-sync'),
    options = { repo: './',
    			branch: file,
                number: 2,
                fields: [ 'hash'
                        , 'abbrevHash'
                        , 'subject'
                        , 'authorName'
                        , 'authorDateRel'
                        ] }

gitlog(options, function(error, commits) {
  console.log('Please commit your change before using marionette-git.');

  console.log('----------------------------------------');
  console.log('Compare:');
  console.log(commits[0]);
  console.log('with previous version:');
  console.log(commits[1]);
  console.log('----------------------------------------');

  var branch_name = execSync('git symbolic-ref -q --short HEAD');

  try{
  	if(file)
      execSync('bin/gaia-marionette ' + file);
    else
      execSync('make test-integration');

  	console.log('First version complete...');
  } catch (err) { 
    console.log('Running marionette failed');
  };
  try{
    execSync('git checkout ' + commits[1].hash);
  } catch (err) { /* err */ };
  try{
  	if(file)
      execSync('bin/gaia-marionette ' + file);
    else
      execSync('make test-integration');
    console.log('Second version complete...');
  } catch (err) {
  	console.log('Running marionette failed');
  };
  try{
    execSync('git checkout ' + branch_name);
  } catch (err) { /* err */ };

  console.log('Done...');
})