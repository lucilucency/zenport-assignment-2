import Validator from './validator';

export function validate(rule, value, includeRequired) {
  let name = rule;
  if (name !== 'required' || includeRequired) {
    let extra;
    const splitIdx = rule.indexOf(':');
    if (splitIdx !== -1) {
      name = rule.substring(0, splitIdx);
      extra = rule.substring(splitIdx + 1);
    }
    return Validator[name](value, extra);
  }
  return Boolean(value);
}