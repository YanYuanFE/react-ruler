export const SENSITIVE_TYPE = {
  normal: {
    name: '三级敏感词',
    min: 0,
    max: 9,
    step: 1,
    value: 5
  },
  warning: {
    name: '二级敏感词',
    min: 10,
    max: 19,
    step: 1,
    value: 15
  },
  danger: {
    name: '一级敏感词',
    min: 20,
    max: 99,
    step: 2,
    value: 57
  },
  forbid: {
    name: '禁止词',
  },
};
