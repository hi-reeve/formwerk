# @formwerk/core

## 0.1.18

### Patch Changes

- f9d9416: feat: add isFieldDirty to useForm
- 2a8e808: feat: add form repeater implementation
- 3759cc1: feat: reset re-validates by default
- 05ecda4: feat: drop inline groups
- 8ce260b: refactor: rename `mode` to `behavior` with setValue

## 0.1.17

### Patch Changes

- 4f70409: fix: skip disabled options from the focus order
- 591f7c4: fix: add novalidate to the formProps
- b01a6ce: fix: re-apply validationMessage after top-level validations are done

## 0.1.16

### Patch Changes

- 23c2f6d: fix: prevent popup opening when disabled

## 0.1.15

### Patch Changes

- 68b4d97: fix: handle disabled and readonly select states

## 0.1.14

### Patch Changes

- 0dd3d8e: fix: prevent thumb focus if disabled
- 2fb6f90: fix: slider vertical orientation thumb positioning

## 0.1.13

### Patch Changes

- 61a0ec0: feat: expose error message props on slider ecosystem
- 6523ba9: fix: run validation when thumb value changes
- 4205a69: fix: avoid reading validation state from grouped checkboxes or radios if a sibling is valid
- 90b0102: feat: add useThumbMetadata composable
- 419eeff: fix: adjust how thumbs are being registered in sliders
- ba4e329: fix: disable slider value changes when readonly or disabled
- 9d612aa: fix: add disableHtmlValidation on checkbox groups

## 0.1.12

### Patch Changes

- 0274c1f: fix: ensure validation is run on keydown for radios and checkboxes
- 59de4fd: feat(checkboxes): add ability to change group state
- 8a4aae1: fix: remove orientation prop from checkboxes
- 7a7c226: feat: add standalone prop to opt checkboxes out of the group

## 0.1.11

### Patch Changes

- c5ce5a1: fix: validate switches on click if custom
- 68775ed: feat: individual checkboxes should not report error message if in group
- 4cdde34: fix: readonly and disabled search fields are not clearable
- 4d2efc6: feat: add isGrouped state for checkboxes
- 16faf37: feat: add clear button label prop to useSearchField
- 14425a9: fix: switches readonly and disabled interaction prevention

## 0.1.10

### Patch Changes

- 90baccc: fix: radio focus navigation not wrapping around edges

## 0.1.9

### Patch Changes

- dc9cc4e: fix: navigating radios around disabled items

## 0.1.8

### Patch Changes

- d3f51a7: fix: readonly should not allow selection for checked
- b545643: fix: use click events to update validity for radios

## 0.1.7

### Patch Changes

- 33a630d: fix: readonly should prevent value mutation on radio and checkboxes
- 44a0bcd: fix: radio and checkboxes isDisabled state

## 0.1.6

### Patch Changes

- 7dc0e69: feat: allow non-button elements for spin buttons
- 1f9f28f: fix: disable number spin buttons if it is either disabled or readonly
- 2017403: fix: multi-input validity support for radio

## 0.1.5

### Patch Changes

- 0ce56e1: chore: upgrade dependencies and reduce vue minimum version
- f89c2c5: fix: use value prop to init textual fields values

## 0.1.4

### Patch Changes

- 2ebb2b7: fix: radio items no validating on multiple interactions

## 0.1.3

### Patch Changes

- be87654: feat: export version constant
- ff28d3d: fix: validation should trigger on grouped components changes
- c680f7f: fix: labels and descriptions aria are applied when their elements/values exist

## 0.1.2

### Patch Changes

- 056fda1: fix: include klona in output

## 0.1.1

### Patch Changes

- 0d551e5: feat: rename listbox props to popupProps

## 0.1.0

### Minor Changes

- 4634ea5: Initial internal test release
