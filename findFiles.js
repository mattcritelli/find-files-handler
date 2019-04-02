'use strict'

// Use the below to automatically create the list of array.
// Must be run in node, will not work in browser
const fs = require('fs');
const util = require('util')
const multiConditionHandler = require('./multiConditionHandler');


function findFileNames(dirName) {
  // directory below may need to be modified slightly depending on folder structure
  return fs.readdirSync(`${dirName}`)
    .map(filename => filename.replace(/-01.svg/, '')
      .toLowerCase())
    .filter(fn => fn !== '.ds_store');
}

/* Automatically create custom rule objects */
function createCustomRules(filenameList, floorNum) {
  const multiRules = []

  filenameList.forEach(filename => {
    let count = multiConditionHandler.conditionalCount(filename)

    if (count >= 1) {
      const conditionalIndices = multiConditionHandler.findIndexOfEachConditional(filename)
      const sortedConditionals = multiConditionHandler.sortMultiConditionIntoArrays(conditionalIndices, filename)
      const ruleToAdd = multiConditionHandler.formatMultiCustomRule(sortedConditionals, floorNum, filename)
      multiRules.push(ruleToAdd)
    }
  })
  return multiRules;
}

/* Create non-duplicate list of all possible options */
function sanitizeWhitelist(customRules, initialList) {
  const aggregateOptions = []
  const output = []

  customRules.forEach(rule => {
    // Filter altHref's (conditional filenames from initialList)
    // i.e. 'dvgslstcorn or woodlstcorn or eleclstcorn' would be removed
    initialList = initialList.filter(filename => filename !== rule.altHref)

    // Iterate through each Custom Rule multigroup and push each individual option into aggregateOptions
    Object.keys(rule.multiGroup).forEach(group => {
      rule.multiGroup[group].forEach(opt => aggregateOptions.push(opt))
    })
  })

  // For each option in aggregateOptions, check to see if output array already includes the option
  // --> If it does not, then add option to output array
  // console.log('aggregateOptions', aggregateOptions)
  aggregateOptions.forEach(opt => {
    if (!output.includes(opt)) {
      output.push(opt)
    }
  })

  // Return the concatenation of the output list and the modified initialList that has
  // all conditional filenames removed
  return output.concat(initialList)
}

function findAllSingleOptions(customRules, whitelist) {
  let output = [];

  customRules.forEach(rule => {
    Object.keys(rule.multiGroup).forEach(group => {
      rule.multiGroup[group].forEach(option => {
        if (!output.includes(option)) {
          output.push(option)
        }
      })
    })
  })

  return whitelist.filter(opt => !output.includes(opt));
}
//////////////////////////////////////////////////////////////////////
//                                                                  //
// FOR NOW - NEED TO MANUALLY ADJUST BELOW BASED ON MODEL SPECIFICS //
//                                                                  //
//////////////////////////////////////////////////////////////////////

// OAKWOOD DIRECTORIES
// const directory = 'Oakwood/167_2321/167_2321'
// const directory = 'Oakwood/167_2322v2'
// const directory = 'Oakwood/167_2323/167_2323v2Rev'
// const directory = 'Oakwood/167_2324/167_2324'
// const directory = 'Oakwood/167_2325/167_2325'
// const directory = 'Oakwood/167_2325/167_2327'


// ARBOR HOME DIRECTORIES

// const directory = 'Arbor/Phase_2/219_940'
// const directory = 'Arbor/Bradford(868)/199_868'
// const directory = 'Arbor/Chestnut(869)/199_869'
// const directory = 'Arbor/199_864-Cottonwood'
// const directory = 'Arbor/199_872-Aspen/199_872'
const directory = 'Arbor/Phase_2/218_867'
// const directory = 'Arbor/Magnolia(880)'
// const directory = 'Arbor/Cooper(7448)'
// const directory = 'Arbor/Mulberry(874)-Update 11-1'
// const directory = 'Arbor/Empress(877)'
// const directory = 'Arbor/Norway(875)'
// const directory = 'Arbor/Spruce(873)'
// const directory = 'Arbor/Walnut(870)'
// const directory = 'test'

const oneFloorArray = ['floor_1']
const twoFloorArray = ['floor_1', 'floor_2']
const threeFloorArray = ['floor_1', 'floor_2', 'floor_3']


callWithOneFloors(directory, oneFloorArray)
// callWithTwoFloors(directory, twoFloorArray)
// callWithThreeFloors(directory, threeFloorArray)



function callWithThreeFloors(directory, floorArray) {

  let floor_1 = findFileNames(`../${directory}/${floorArray[0]}`)
  // console.log('\n floor_1 options:', floor_1)

  let floor_2 = findFileNames(`../${directory}/${floorArray[1]}`)
  // console.log('floor_2 options:', floor_2)

  let floor_3 = findFileNames(`../${directory}/${floorArray[2]}`)
  // console.log('floor_3 options:', floor_3)

  const customRulesFloorOne = createCustomRules(floor_1, 1)
  const customRulesFloorTwo = createCustomRules(floor_2, 2)
  const customRulesFloorThree = createCustomRules(floor_3, 3)

  const whitelistOutputFloorOne = sanitizeWhitelist(customRulesFloorOne, floor_1)
  const whitelistOutputFloorTwo = sanitizeWhitelist(customRulesFloorTwo, floor_2)
  const whitelistOutputFloorThree = sanitizeWhitelist(customRulesFloorThree, floor_3)


  const singleOptionsOne = findAllSingleOptions(customRulesFloorOne, whitelistOutputFloorOne)
  const singleOptionsTwo = findAllSingleOptions(customRulesFloorTwo, whitelistOutputFloorTwo)
  const singleOptionsThree = findAllSingleOptions(customRulesFloorThree, whitelistOutputFloorThree)


  console.log('\nSingle Options', singleOptions)
  console.log('\nfloor_1:', singleOptionsOne)
  console.log('\nfloor_2:', singleOptionsTwo)
  console.log('\nfloor_3:', singleOptionsThree)

  console.log('\nWhitelists:');
  console.log('floor_1:', whitelistOutputFloorOne)
  console.log('floor_2:', whitelistOutputFloorTwo)
  console.log('floor_3:', whitelistOutputFloorThree)

  console.log('all Custom Rules:', util.inspect(customRulesFloorOne.concat(customRulesFloorTwo).concat(customRulesFloorThree), { showHidden: false, depth: null }))
}

function callWithTwoFloors(directory, floorArray) {
  let floor_1 = findFileNames(`../${directory}/${floorArray[0]}`)
  // console.log('\n floor_1 options:', floor_1)

  let floor_2 = findFileNames(`../${directory}/${floorArray[1]}`)
  // console.log('floor_2 options:', floor_2)

  const customRulesFloorOne = createCustomRules(floor_1, 1)
  const customRulesFloorTwo = createCustomRules(floor_2, 2)

  const whitelistOutputFloorOne = sanitizeWhitelist(customRulesFloorOne, floor_1)
  const whitelistOutputFloorTwo = sanitizeWhitelist(customRulesFloorTwo, floor_2)

  const singleOptionsOne = findAllSingleOptions(customRulesFloorOne, whitelistOutputFloorOne)
  const singleOptionsTwo = findAllSingleOptions(customRulesFloorTwo, whitelistOutputFloorTwo)

  console.log('\nSingle Options', singleOptions)
  console.log('\nfloor_1:', singleOptionsOne)
  console.log('\nfloor_2:', singleOptionsTwo)


  console.log('\nWhitelists:');
  console.log('floor_1:', whitelistOutputFloorOne)
  console.log('floor_2:', whitelistOutputFloorTwo)


  console.log('all Custom Rules:', util.inspect(customRulesFloorOne.concat(customRulesFloorTwo), { showHidden: false, depth: null }))
}


function callWithOneFloors(directory, floorArray) {
  let floor_1 = findFileNames(`../${directory}/${floorArray[0]}`)
  // console.log('\n floor_1 options:', floor_1)

  const customRulesFloorOne = createCustomRules(floor_1, 1)

  // console.log('\nWhitelists:');
  const whitelistOutputFloorOne = sanitizeWhitelist(customRulesFloorOne, floor_1)

  const singleOptionsOne = findAllSingleOptions(customRulesFloorOne, whitelistOutputFloorOne)

  console.log('\nWhitelists:');
  console.log('\nfloor_1:', whitelistOutputFloorOne)

  console.log('\nSingle Options', singleOptions)
  console.log('\nfloor_1:', singleOptionsOne)

  console.log('all Custom Rules:', util.inspect(customRulesFloorOne, { showHidden: false, depth: null }))
}







/* Extract all file names from individual floor option folders */

// let floor_0 = findFileNames(`../${directory}/floor_0`)
// console.log('floor_0 options:', floor_0)
//
// let floor_1 = findFileNames(`../${directory}/floor_1`)
// // console.log('\n floor_1 options:', floor_1)
// // //
// let floor_2 = findFileNames(`../${directory}/floor_2`)
// // console.log('floor_2 options:', floor_2)
// //
// let floor_3 = findFileNames(`../${directory}/floor_3`)
// console.log('floor_3 options:', floor_3)
//
// /* Automatically create custom rule objects */
// // const customRulesFloorZero = createCustomRules(floor_0, 0)
// const customRulesFloorOne = createCustomRules(floor_1, 1)
// const customRulesFloorTwo = createCustomRules(floor_2, 2)
// const customRulesFloorThree = createCustomRules(floor_3, 3)
//
//
// // console.log('customRulesFloorZero:', customRulesFloorZero)
// // console.log('customRulesFloorOne:', util.inspect(customRulesFloorOne, {showHidden: false, depth: null}))
// // console.log('customRulesFloorTwo:', customRulesFloorTwo)
// // console.log('customRulesFloorThree:', util.inspect(customRulesFloorThree, {showHidden: false, depth: null}))
// // console.log('\n all Custom Rules:', util.inspect(customRulesFloorOne, {showHidden: false, depth: null}))
// // console.log('all Custom Rules:', util.inspect(customRulesFloorZero.concat(customRulesFloorOne).concat(customRulesFloorTwo).concat(customRulesFloorThree), {showHidden: false, depth: null}))
// // console.log('all Custom Rules:', util.inspect(customRulesFloorOne.concat(customRulesFloorTwo), {showHidden: false, depth: null}))
// console.log('all Custom Rules:', util.inspect(customRulesFloorOne.concat(customRulesFloorTwo).concat(customRulesFloorThree), {showHidden: false, depth: null}))
//
//
// /* Create non-duplicate list of all possible options */
// // const whitelistOutputFloorZero = sanitizeWhitelist(customRulesFloorZero, floor_0)
// const whitelistOutputFloorOne = sanitizeWhitelist(customRulesFloorOne, floor_1)
// const whitelistOutputFloorTwo = sanitizeWhitelist(customRulesFloorTwo, floor_2)
// const whitelistOutputFloorThree = sanitizeWhitelist(customRulesFloorThree, floor_3)
//
//
// // console.log('WHITELISTS')
// // console.log('floor_0:', whitelistOutputFloorZero)
// console.log('floor_1:', whitelistOutputFloorOne)
// console.log('floor_2:', whitelistOutputFloorTwo)
// console.log('floor_3:', whitelistOutputFloorThree)






/******* PHASE 1 ************/
// const directory = 'Arbor/219_940-Jefferson/219_940'
// const directory = 'Arbor/Bradford(868)/199_868'
// const directory = 'Arbor/Chestnut(869)/199_869'
// const directory = 'Arbor/199_864-Cottonwood'
// const directory = 'Arbor/199_872-Aspen/199_872'
// const directory = 'Arbor/199_867-Ashton'
// const directory = 'Arbor/Magnolia(880)'
// const directory = 'Arbor/Cooper(7448)'
// const directory = 'Arbor/Mulberry(874)-Update 11-1'
// const directory = 'Arbor/Empress(877)'
// const directory = 'Arbor/Norway(875)'
// const directory = 'Arbor/Spruce(873)'
// const directory = 'Arbor/Walnut(870)'