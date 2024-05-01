"use strict";
const _ = require("lodash");

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

// ['a', 'b'] = {a: 1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

// ['a', 'b'] = {a: 0, b: 0}
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedOrNullObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => ![null, undefined].includes(value))
      .map(([key, value]) => [
        key,
        typeof value === "object" ? removeUndefinedOrNullObject(value) : value,
      ])
  );
};

const updateNestedObjectParser = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const nestedObj = updateNestedObjectParser(obj[key]);
      Object.entries(nestedObj).forEach(([nestedKey, nestedValue]) => {
        acc[`${key}.${nestedKey}`] = nestedValue;
      });
    } else {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedOrNullObject,
  updateNestedObjectParser,
};
