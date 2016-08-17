# v2.1.1
* README typo correction

# v2.1.0
* Fix [Issue #4](https://github.com/tonybranfort/filter-objects/issues/4): Inherited properties not being checked for matches and filter.  This __could be a breaking change__ if you aren't expecting inherited properties to be checked.  If so, use doNotCheckInherited option.

New Features
* doNotCheckInherited: Option that allows inherited properties to not be checked for matches and filter (those properties will be considered missing). The default, with Issue # 4 fix, is to include inherited properties; ie doNotCheckInherited=false. 

Other
* [Performance test results](https://github.com/tonybranfort/filter-objects/blob/master/performance/perf-overall-summary.txt) for v2.0.0 and v2.1.0 added. 

# v2.0.0
Breaking Changes
* `getVariablesFn` option removed and replaced with `variables` option.  (See [Issue #3](https://github.com/tonybranfort/filter-objects/issues/3))
* Deprecated `variablesAllowed` option removed.  (Replaced with variablesInTObj and variablesInPObj in v1.1.0).

New Features
* Add option `matchIfBothPropMissing`. 
* Add `setNestedPropOptions` function. 
* Expose `setOptionsOnProps` function. 

Bug Fixes
* Fix [Issue #1](https://github.com/tonybranfort/filter-objects/issues/1): false positives w matchIf_ObjMissing w regExp. 
* Fix [Issue #2](https://github.com/tonybranfort/filter-objects/issues/2): Multiple variables in one property may not be replaced correctly

Other
* Add Node 6 to testing. 

# v1.1.1
* No functionality changes or fixes.  Simply add warning if `getVariablesFn` is used in options.  See [Issue #3](https://github.com/tonybranfort/filter-objects/issues/3).  

# v1.1.0
- Deprecate variablesAllowed option parameter and replace with variablesInTObj and variablesInPObj
- Add performance testing summary
- Add support for bower install

# v1.0.0
- Initial release 
