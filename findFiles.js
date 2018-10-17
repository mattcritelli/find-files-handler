// Use the below to automatically create the list of array.
// Must be run in node, will not work in browser
const fs = require('fs');
const util = require('util')
const multiConditionHandler = require('./multiConditionHandler');


function findFileNames(dirName){
  // directory below may need to be modified slightly depending on folder structure
  return fs.readdirSync(`${dirName}`)
           .map(filename => filename.replace(/-01.svg/, '').toLowerCase());
}

/* Automatically create custom rule objects */
function createCustomRules(optionsArray, floorNum){
  const conditionals = [' and not ', ' and ', ' join ', ' or '] // 'and not' must come before 'and' to properly sort
  const primaryOutput = [];
  const joinRules = [];
  const multiRules = []

  optionsArray.forEach(option => {
    let count = multiConditionHandler.conditionalCount(option)

    if (count >= 1){
      const conditionalIndices = multiConditionHandler.findIndexOfEachConditional(option)
      const sortedConditionals = multiConditionHandler.sortMultiConditionIntoArrays(conditionalIndices, option)
      const ruleToAdd = multiConditionHandler.formatMultiCustomRule(sortedConditionals, floorNum, option)
      multiRules.push(ruleToAdd)
    }
  })
  return primaryOutput.concat(joinRules).concat(multiRules)
}

/* Create non-duplicate list of all possible options */
function sanitizeWhitelist(customRules, initialList){
  initialList = initialList.filter(opt => opt !== '.ds_store')
  const aggregateOptions = []
  const output = []

  customRules.forEach(rule => {
    // remove all conditional filenames from initial list
    // i.e. 'dvgslstcorn or woodlstcorn or eleclstcorn' would be removed
    const optIndex = initialList.indexOf(rule.altHref)
    if(optIndex >= 0){
      initialList.splice(optIndex, 1)
    }

    if(rule.ruleType !== 'multi'){
      // add individual options in conditional filename to aggregateOptions
      // i.e. [ 'dvgslstcorn', 'woodlstcorn', 'eleclstcorn' ]
      rule.hrefs.forEach(opt => aggregateOptions.push(opt))
    } else {
      Object.keys(rule.multiGroup).forEach(group => {
        rule.multiGroup[group].forEach(opt => aggregateOptions.push(opt))
      })
    }
  })

  // Remove all duplicates by checking output array before adding
  aggregateOptions.forEach(opt => {
    if(!output.includes(opt)){
      output.push(opt)
    }
  })
  return output.concat(initialList)
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


// ARBOR HOME DIRECTORIES
// const directory = 'Arbor/Bradford(868)/199_868'
// const directory = 'Arbor/Chestnut(869)/199_869'
// const directory = 'Arbor/199_864-Cottonwood'
// const directory = 'Arbor/199_872-Aspen/199_872'
// const directory = 'Arbor/199_867-Ashton'
// const directory = 'Arbor/Magnolia(880)'
// const directory = 'Arbor/Cooper(7448)'
// const directory = 'Arbor/Mulberry(874)'
// const directory = 'Arbor/Empress(877)'
// const directory = 'Arbor/Norway(875)'
const directory = 'Arbor/Spruce(873)'
// const directory = 'Arbor/Walnut(870)'


/* Extract all file names from individual floor option folders */

// let floor_0 = findFileNames(`../${directory}/floor_0`)
// console.log('floor_0 options:', floor_0)
//
let floor_1 = findFileNames(`../${directory}/floor_1`)
// console.log('floor_1 options:', floor_1)
// //
let floor_2 = findFileNames(`../${directory}/floor_2`)
// console.log('floor_2 options:', floor_2)
//
// let floor_3 = findFileNames(`../${directory}/floor_3`)
// console.log('floor_3 options:', floor_3)

/* Automatically create custom rule objects */
// const customRulesFloorZero = createCustomRules(floor_0, 0)
const customRulesFloorOne = createCustomRules(floor_1, 1)
const customRulesFloorTwo = createCustomRules(floor_2, 2)
// const customRulesFloorThree = createCustomRules(floor_3, 3)


// console.log('customRulesFloorZero:', customRulesFloorZero)
// console.log('customRulesFloorOne:', customRulesFloorOne)
// console.log('customRulesFloorTwo:', customRulesFloorTwo)
// console.log('customRulesFloorThree:', customRulesFloorThree)
// console.log('all Custom Rules:', util.inspect(customRulesFloorOne, {showHidden: false, depth: null}))
// console.log('all Custom Rules:', util.inspect(customRulesFloorZero.concat(customRulesFloorOne).concat(customRulesFloorTwo).concat(customRulesFloorThree), {showHidden: false, depth: null}))
console.log('all Custom Rules:', util.inspect(customRulesFloorOne.concat(customRulesFloorTwo), {showHidden: false, depth: null}))
// console.log('all Custom Rules:', util.inspect(customRulesFloorOne.concat(customRulesFloorTwo).concat(customRulesFloorThree), {showHidden: false, depth: null}))


/* Create non-duplicate list of all possible options */
// const whitelistOutputFloorZero = sanitizeWhitelist(customRulesFloorZero, floor_0)
const whitelistOutputFloorOne = sanitizeWhitelist(customRulesFloorOne, floor_1)
const whitelistOutputFloorTwo = sanitizeWhitelist(customRulesFloorTwo, floor_2)
// const whitelistOutputFloorThree = sanitizeWhitelist(customRulesFloorThree, floor_3)


// console.log('WHITELISTS')
// console.log('floor_0:', whitelistOutputFloorZero)
console.log('floor_1:', whitelistOutputFloorOne)
console.log('floor_2:', whitelistOutputFloorTwo)
// console.log('floor_3:', whitelistOutputFloorThree)
