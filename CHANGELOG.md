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
