var reference = {
  // for descriptions only
  filter: "filter test using makeFilterFn()",
  filterJsArray: "filter test using straight js array filter without filter-objects", 
  match: "match test using match from create makeMatchFn()",
  regMatch: "regular expression match test",
  matchSimple: "match test calling matches() directly withou creating makeMatchFn()",
  k1to1: "1 pObj property matched to tObj with 1 property",
  k1to100: "1 pObj property matched against 1 tObj prop in tObj of 100 properties",
  k10to100: "10 pObj properties matched against 10 tObj props in tObj of 100 properties",
  k100to100: "100 pObj properties matched against 100 tObj props in tObj of 100 properties",
  fixedKey: "Every object in array of pObjs tests the same property key (but different value for each pObj & tObj)",
  k1d: "Property key is 1 level deep", 
  k4d: "Property key is 4 levels deep; eg type.tail.tip.color", 
  pWord: "3 to 10 random characters in pObj value",
  tWord: "3 to 10 random characters in tObj value",
  pString: "pObj is a string of 30 to 150 random characters",
  tString: "tObj is a string of 30 to 150 random characters",
  tPhone: "tObj is a phone number of various possible accepted formats",
  pParagraph: "pObj is a string of of 5-200 \'words\' of random 3-10 chars seperated by spaces",
  tParagraph: "pObj is a string of of 5-200 \'words\' of random 3-10 chars seperated by spaces",
  charDotStar: "reg exp=>1 rand char followed by .* by 1 rand char eg /B.*l/",
  pRegDotStar: "pObj has reg exp 1 rand char followed by .* by rand char eg /B.*l/",
  pRegDot: "pObj has one character replaced with \.\ for reg exp test",
  pRegMidStr: "pObj has a random number of consecutive characters from tObj string; eg /anke/",
  pRegPhone: "pObj is a regular expression that tests for phone format",
  m50: "~50% match between pObjs & tObjs",
  m100: "100% match between pObjs & tObjs",
  v100to100: "volume 100: 100 unique pObj objects, 100 unique tObj objects; filter tests filter each pObj to 100 tObjs; match tests go 1:1",
  v1kto1k: "volume 1,000: 1,000 unique pObj objects against 1,000 unique tObj objects; filter tests filter each pObj to 1000 tObjs; match tests go 1:1",
  v10kto10k: "volume 10,000: 10k unique pObj objects against 10k unique tObj objects; filter tests filter each pObj to 10k tObjs; match tests go 1:1",
  v100kto100k: "volume 100,000: 100k unique pObj objects against 100k unique tObj objects; filter tests filter each pObj to 10pk tObjs; match tests go 1:1",
};

var perfTests = 
{ v100to1k : [
  // MATCH  1 Word to 1 Word
  {
    testName: 'match_k1to1_pWord_tWord_m50_v100to100',
    tObj: {
      fileName: 'k1_word_v100.json'
    },
    pObj: {
      fileName:'k1_word_v100_ditto_m50.json' 
    },
    testFn: 'testMatch', 
    props: ["prop1"]
  },
  {
    testName: 'match_k1to1_pWord_tWord_m50_v1kto1k',
    tObj: {
      fileName: 'k1_word_v1k.json'
    },
    pObj: {
      fileName:'k1_word_v1k_ditto_m50.json' 
    },
    testFn: 'testMatch', 
    props: ["prop1"]
  },
  {
    testName: 'matchSimple_k1to1_pWord_tWord_m50_v100to100',
    tObj: {
      fileName: 'k1_word_v100.json'
    },
    pObj: {
      fileName:'k1_word_v100_ditto_m50.json' 
    },
    testFn: 'testMatchSimple', 
  },
  {
    testName: 'matchSimple_k1to1_pWord_tWord_m50_v1kto1k',
    tObj: {
      fileName: 'k1_word_v1k.json'
    },
    pObj: {
      fileName:'k1_word_v1k_ditto_m50.json' 
    },
    testFn: 'testMatchSimple', 
  },
  {
    testName: 'match_k1to1_pString_tString_m50_v100to100',
    tObj: {
      fileName: 'k1_string_v100.json'
    },
    pObj: {
      fileName:'k1_string_v100_ditto_m50.json' 
    },
    testFn: 'testMatch', 
    props: ["prop1"]
  },
  {
    testName: 'match_k1to1_pString_tString_m50_v1kto1k',
    tObj: {
      fileName: 'k1_string_v1k.json'
    },
    pObj: {
      fileName:'k1_string_v1k_ditto_m50.json' 
    },
    testFn: 'testMatch', 
    props: ["prop1"]
  },
  // MATCH Paragraph 
  {
    testName: 'match_k1to1_pParagraph_tParagraph_m50_v100to100',
    tObj: {
      fileName: 'k1_paragraph_v100.json'
    },
    pObj: {
      fileName:'k1_paragraph_v100_ditto_m50.json' 
    },
    testFn: 'testMatch', 
    props: ["prop1"]
  },
  {
    testName: 'match_k1to1_pParagraph_tParagraph_m50_v1kto1k',
    tObj: {
      fileName: 'k1_paragraph_v1k.json'
    },
    pObj: {
      fileName:'k1_paragraph_v1k_ditto_m50.json' 
    },
    testFn: 'testMatch', 
    props: ["prop1"]
  },

  // REG EXP Mid Str 
  {
    testName: 'regMatch_k1to1_pRegMidStr_tWord_m50_v100to100',
    tObj: {
      fileName:'k1_word_v100.json'
    },
    pObj: {
      fileName:'k1_word_v100_regMidStr_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  {
    testName: 'regMatch_k1to1_pRegMidStr_tWord_m50_v1kto1k',
    tObj: {
      fileName:'k1_word_v1k.json'
    },
    pObj: {
      fileName:'k1_word_v1k_regMidStr_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  // REG EXP Dot - reg exp match with one '.' in pattern, 50% match
  {
    testName: 'regMatch_k1to1_pRegDot_tWord_m50_v100to100',
    tObj: {
      fileName:'k1_word_v100.json'
    },
    pObj: {
      fileName:'k1_word_v100_regDot_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  {
    testName: 'regMatch_k1to1_pRegDot_tWord_m50_v1kto1k',
    tObj: {
      fileName:'k1_word_v1k.json'
    },
    pObj: {
      fileName:'k1_word_v1k_regDot_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  // REG EXP DotStar - reg exp match with '.*' in pattern, 50% match
  {
    testName: 'regMatch_k1to1_pRegDotStar_tWord_m50_v100to100',
    tObj: {
      fileName:'k1_word_v100.json'
    },
    pObj: {
      fileName:'k1_word_v100_regDotStar_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  {
    testName: 'regMatch_k1to1_pRegDotStar_tWord_m50_v1kto1k',
    tObj: {
      fileName:'k1_word_v1k.json'
    },
    pObj: {
      fileName:'k1_word_v1k_regDotStar_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  // REG EXP Phone - match using reg ex phone pattern, 50% match
  {
    testName: 'regMatch_k1to1_pRegPhone_tPhone_m50_v100to100',
    tObj: {
      fileName:'k1_phone_v100.json'
    },
    pObj: {
      fileName:'k1_phone_v100_regPhone_m50.json' 
    },
    testFn: 'testMatch', 
    props: {phone: {regExpMatch:true}}
  },
  {
    testName: 'regMatch_k1to1_pRegPhone_tPhone_m50_v1kto1k',
    tObj: {
      fileName:'k1_phone_v1k.json'
    },
    pObj: {
      fileName:'k1_phone_v1k_regPhone_m50.json' 
    },
    testFn: 'testMatch', 
    props: {phone: {regExpMatch:true}}
  },
  // k1to100_m50 - Match one property in pObj to tObj with 100 props
  {
    testName: 'matchSimple_k1to100_m50_v100to100',
    tObj: {
      fileName:'k100_randObj_v100.json'
    },
    pObj: {
      fileName:'k100_randObj_v100_k1_m50.json' 
    },
    testFn: 'testMatchSimple' 
  },
  {
    testName: 'matchSimple_k1to100_m50_v1kto1k',
    tObj: {
      fileName:'k100_randObj_v1k.json'
    },
    pObj: {
      fileName:'k100_randObj_v1k_k1_m50.json' 
    },
    testFn: 'testMatchSimple' 
  },
  // k1to100_m50 - Match one property in pObj to tObj with 100 props
  {
    testName: 'match_k1to100_m50_v100to100',
    tObj: {
      fileName:'k100_randObj_v100.json'
    },
    pObj: {
      fileName:'k100_randObj_v100_k1_m50.json' 
    },
    testFn: 'testMatch' 
  },
  {
    testName: 'match_k1to100_m50_v1kto1k',
    tObj: {
      fileName:'k100_randObj_v1k.json'
    },
    pObj: {
      fileName:'k100_randObj_v1k_k1_m50.json' 
    },
    testFn: 'testMatch' 
  },
  // k10to100_m50 - Match 10 properties in pObj to tObj with 100 props
  {
    testName: 'match_k10to100_m50_v100to100',
    tObj: {
      fileName:'k100_randObj_v100.json'
    },
    pObj: {
      fileName:'k100_randObj_v100_k10_m50.json' 
    },
    testFn: 'testMatch' 
  },
  {
    testName: 'match_k10to100_m50_v1kto1k',
    tObj: {
      fileName:'k100_randObj_v1k.json'
    },
    pObj: {
      fileName:'k100_randObj_v1k_k10_m50.json' 
    },
    testFn: 'testMatch' 
  },
  // k100to100_m100 - Match 100 properties in pObj to tObj, 100% match
  {
    testName: 'match_k100to100_m100_v100to100',
    tObj: {
      fileName:'k100_randObj_v100.json'
    },
    pObj: {
      fileName:'k100_randObj_v100_k100_m100.json' 
    },
    testFn: 'testMatch' 
  },
  {
    testName: 'match_k100to100_m100_v1kto1k',
    tObj: {
      fileName:'k100_randObj_v1k.json'
    },
    pObj: {
      fileName:'k100_randObj_v1k_k100_m100.json' 
    },
    testFn: 'testMatch' 
  },

  // -----------------------------------------------------
  // FILTER TESTS
  // -----------------------------------------------------
  // k1to100_word - Match 100 properties in pObj to tObj, 100% match
  {
    testName: 'filter_k1to1_pWord_tWord_m50_v100to100',
    tObj: {
      fileName: 'k1_word_v100.json'
    },
    pObj: {
      fileName:'k1_word_v100_ditto_m50.json' 
    },
    testFn: 'testFilter', 
    props: ["prop1"]
  },
  {
    testName: 'filter_k1to1_pWord_tWord_m50_v1kto1k',
    tObj: {
      fileName: 'k1_word_v1k.json'
    },
    pObj: {
      fileName:'k1_word_v1k_ditto_m50.json' 
    },
    testFn: 'testFilter', 
    props: ["prop1"]
  },
  // k1to100_pRegDotStar - Match 100 properties in pObj to tObj, 100% match
  {
    testName: 'filter_k1to1_pRegDotStar_tWord_m50_v100to100',
    tObj: {
      fileName:'k1_word_v100.json'
    },
    pObj: {
      fileName:'k1_word_v100_regDotStar_m50.json' 
    },
    testFn: 'testFilter', 
    props: {prop1: {regExpMatch:true}}
  },
  {
    testName: 'filter_k1to1_pRegDotStar_tWord_m50_v1kto1k',
    tObj: {
      fileName:'k1_word_v1k.json'
    },
    pObj: {
      fileName:'k1_word_v1k_regDotStar_m50.json' 
    },
    testFn: 'testFilter', 
    props: {prop1: {regExpMatch:true}}
  },

  {
    testName: 'filter_k1to100_m50_v100to100',
    tObj: {
      fileName:'k100_randObj_v100.json'
    },
    pObj: {
      fileName:'k100_randObj_v100_k1_m50.json' 
    },
    testFn: 'testFilter' 
  },
  {
    testName: 'filter_k1to100_m50_v1kto1k',
    tObj: {
      fileName:'k100_randObj_v1k.json'
    },
    pObj: {
      fileName:'k100_randObj_v1k_k1_m50.json' 
    },
    testFn: 'testFilter' 
  },

  {
    testName: 'filter_k10to100_m50_v100to100',
    tObj: {
      fileName:'k100_randObj_v100.json'
    },
    pObj: {
      fileName:'k100_randObj_v100_k10_m50.json' 
    },
    testFn: 'testFilter' 
  },
  {
    testName: 'filter_k10to100_m50_v1kto1k',
    tObj: {
      fileName:'k100_randObj_v1k.json'
    },
    pObj: {
      fileName:'k100_randObj_v1k_k10_m50.json' 
    },
    testFn: 'testFilter' 
  },
  // {
  //   testName: 'filter_k10to100_m50_v10kto10k',
  //   tObj: {
  //     fileName:'k100_randObj_v10k.json'
  //   },
  //   pObj: {
  //     fileName:'k100_randObj_v10k_k10_m50.json' 
  //   },
  //   testFn: 'testFilter' 
  // },

  {
    testName: 'filter_k100to100_m100_v100to100',
    tObj: {
      fileName:'k100_randObj_v100.json'
    },
    pObj: {
      fileName:'k100_randObj_v100_k100_m100.json' 
    },
    testFn: 'testFilter' 
  },
  {
    testName: 'filter_k1to100_charDotStar_v1kto100',
    tObj: {
      fileName:'k100_fixedKey_v100.json'
    },
    pObj: {
      fileName:'k100_fixedKey_k1_charDotStar_v1k.json' 
    },
    testFn: 'testFilter',
    options: {regExpMatch: true}
  },
  {
    testName: 'filter_k1to100_charDotStar_v1kto1k',
    tObj: {
      fileName:'k100_fixedKey_v1k.json'
    },
    pObj: {
      fileName:'k100_fixedKey_k1_charDotStar_v1k.json' 
    },
    testFn: 'testFilter',
    options: {regExpMatch: true}
  },
  {
    testName: 'filter_k1to100_fixedKey_k4d_v1kto1k',
    tObj: {
      fileName:'k100_fixedKey_v1k.json'
    },
    pObj: {
      fileName:'k100_fixedKey_v1k.json' 
    },
    testFn: 'testFilter',
    props: ['xCIyyA.NUeUFIa.YwYa.boVGzmWj']
  },
  {
    testName: 'filterJsArray_k1to100_fixedKey_k4d_v1kto1k',
    tObj: {
      fileName:'k100_fixedKey_v1k.json'
    },
    pObj: {
      fileName:'k100_fixedKey_v1k.json' 
    },
    testFn: 'filterJsArray',
    props: ['xCIyyA.NUeUFIa.YwYa.boVGzmWj']
  },
  {
    testName: 'filter_k1to100_fixedKey_k1d_v1kto1k',
    tObj: {
      fileName:'k100_fixedKey_v1k.json'
    },
    pObj: {
      fileName:'k100_fixedKey_v1k.json' 
    },
    testFn: 'testFilter',
    props: ['ABpwoNN']
  },
  {
    testName: 'filterJsArray_k1to100_fixedKey_k1d_v1kto1k',
    tObj: {
      fileName:'k100_fixedKey_v1k.json'
    },
    pObj: {
      fileName:'k100_fixedKey_v1k.json' 
    },
    testFn: 'filterJsArray',
    props: ['ABpwoNN']
  },
], 
v10k : [
  // MATCH  1 Word to 1 Word
  {
    testName: 'match_k1to1_pWord_tWord_m50_v10kto10k',
    tObj: {
      fileName: 'k1_word_v10k.json'
    },
    pObj: {
      fileName:'k1_word_v10k_ditto_m50.json' 
    },
    testFn: 'testMatch', 
    props: ["prop1"]
  },
  // MATCH SIMPLE 1 Word to 1 Word
  {
    testName: 'matchSimple_k1to1_pWord_tWord_m50_v10kto10k',
    tObj: {
      fileName: 'k1_word_v10k.json'
    },
    pObj: {
      fileName:'k1_word_v10k_ditto_m50.json' 
    },
    testFn: 'testMatchSimple', 
  },
  // MATCH String
  {
    testName: 'match_k1to1_pString_tString_m50_v10kto10k',
    tObj: {
      fileName: 'k1_string_v10k.json'
    },
    pObj: {
      fileName:'k1_string_v10k_ditto_m50.json' 
    },
    testFn: 'testMatch', 
    props: ["prop1"]
  },
  // MATCH Paragraph 
  {
    testName: 'regMatch_k1to1_pRegMidStr_tWord_m50_v10kto10k',
    tObj: {
      fileName:'k1_word_v10k.json'
    },
    pObj: {
      fileName:'k1_word_v10k_regMidStr_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  // REG EXP Dot - reg exp match with one '.' in pattern, 50% match
  {
    testName: 'regMatch_k1to1_pRegDot_tWord_m50_v10kto10k',
    tObj: {
      fileName:'k1_word_v10k.json'
    },
    pObj: {
      fileName:'k1_word_v10k_regDot_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  // REG EXP DotStar - reg exp match with '.*' in pattern, 50% match
  {
    testName: 'regMatch_k1to1_pRegDotStar_tWord_m50_v10kto10k',
    tObj: {
      fileName:'k1_word_v10k.json'
    },
    pObj: {
      fileName:'k1_word_v10k_regDotStar_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  // REG EXP Phone - match using reg ex phone pattern, 50% match
  {
    testName: 'regMatch_k1to1_pRegPhone_tPhone_m50_v10kto10k',
    tObj: {
      fileName:'k1_phone_v10k.json'
    },
    pObj: {
      fileName:'k1_phone_v10k_regPhone_m50.json' 
    },
    testFn: 'testMatchSimple', 
    props: {phone: {regExpMatch:true}}
  },
  // k1to100_m50 - Match one property in pObj to tObj with 100 props
  {
    testName: 'matchSimple_k1to100_m50_v10kto10k',
    tObj: {
      fileName:'k100_randObj_v10k.json'
    },
    pObj: {
      fileName:'k100_randObj_v10k_k1_m50.json' 
    },
    testFn: 'testMatchSimple' 
  },
  // k1to100_m50 - Match one property in pObj to tObj with 100 props
  {
    testName: 'match_k1to100_m50_v10kto10k',
    tObj: {
      fileName:'k100_randObj_v10k.json'
    },
    pObj: {
      fileName:'k100_randObj_v10k_k1_m50.json' 
    },
    testFn: 'testMatch' 
  },
  // k10to100_m50 - Match 10 properties in pObj to tObj with 100 props
  {
    testName: 'match_k10to100_m50_v10kto10k',
    tObj: {
      fileName:'k100_randObj_v10k.json'
    },
    pObj: {
      fileName:'k100_randObj_v10k_k10_m50.json' 
    },
    testFn: 'testMatch' 
  },
  // k100to100_m100 - Match 100 properties in pObj to tObj, 100% match
  {
    testName: 'match_k100to100_m100_v10kto10k',
    tObj: {
      fileName:'k100_randObj_v10k.json'
    },
    pObj: {
      fileName:'k100_randObj_v10k_k100_m100.json' 
    },
    testFn: 'testMatch' 
  },
  {
    testName: 'filter_k1to100_charDotStar_v1kto10k',
    tObj: {
      fileName:'k100_fixedKey_v10k.json'
    },
    pObj: {
      fileName:'k100_fixedKey_k1_charDotStar_v1k.json' 
    },
    testFn: 'testFilter',
    options: {regExpMatch: true}
  }
],

v100k : [
  // MATCH  1 Word to 1 Word
  {
    testName: 'match_k1to1_pWord_tWord_m50_v100kto100k',
    tObj: {
      fileName: 'k1_word_v100k.json'
    },
    pObj: {
      fileName:'k1_word_v100k_ditto_m50.json' 
    },
    testFn: 'testMatch', 
    props: ["prop1"]
  },
  // MATCH SIMPLE 1 Word to 1 Word
  {
    testName: 'matchSimple_k1to1_pWord_tWord_m50_v100kto100k',
    tObj: {
      fileName: 'k1_word_v100k.json'
    },
    pObj: {
      fileName:'k1_word_v100k_ditto_m50.json' 
    },
    testFn: 'testMatchSimple', 
  },
  // MATCH String
  {
    testName: 'match_k1to1_pString_tString_m50_v100kto100k',
    tObj: {
      fileName: 'k1_string_v100k.json'
    },
    pObj: {
      fileName:'k1_string_v100k_ditto_m50.json' 
    },
    testFn: 'testMatch', 
    props: ["prop1"]
  },
  // MATCH Paragraph 
  {
    testName: 'regMatch_k1to1_pRegMidStr_tWord_m50_v100kto100k',
    tObj: {
      fileName:'k1_word_v100k.json'
    },
    pObj: {
      fileName:'k1_word_v100k_regMidStr_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  // REG EXP Dot - reg exp match with one '.' in pattern, 50% match
  {
    testName: 'regMatch_k1to1_pRegDot_tWord_m50_v100kto100k',
    tObj: {
      fileName:'k1_word_v100k.json'
    },
    pObj: {
      fileName:'k1_word_v100k_regDot_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  // REG EXP DotStar - reg exp match with '.*' in pattern, 50% match
  {
    testName: 'regMatch_k1to1_pRegDotStar_tWord_m50_v100kto100k',
    tObj: {
      fileName:'k1_word_v100k.json'
    },
    pObj: {
      fileName:'k1_word_v100k_regDotStar_m50.json' 
    },
    testFn: 'testMatch', 
    props: {prop1: {regExpMatch:true}}
  },
  // REG EXP Phone - match using reg ex phone pattern, 50% match
  {
    testName: 'regMatch_k1to1_pRegPhone_tPhone_m50_v100kto100k',
    tObj: {
      fileName:'k1_phone_v100k.json'
    },
    pObj: {
      fileName:'k1_phone_v100k_regPhone_m50.json' 
    },
    testFn: 'testMatchSimple', 
    props: {phone: {regExpMatch:true}}
  },
  // k1to100_m50 - Match one property in pObj to tObj with 100 props
  // -----------------------------------------------------
  // FILTER TESTS
  // -----------------------------------------------------
  // k1to100_word - Match 100 properties in pObj to tObj, 100% match
  {
    testName: 'filter_k1to1_pWord_tWord_m50_v100kto100k',
    tObj: {
      fileName: 'k1_word_v100k.json'
    },
    pObj: {
      fileName:'k1_word_v100k_ditto_m50.json' 
    },
    testFn: 'testFilter', 
    props: ["prop1"]
  },
  // k1to100_pRegDotStar - Match 100 properties in pObj to tObj, 100% match

]
};


module.exports = {
  perfTests: perfTests,
  reference: reference
};


