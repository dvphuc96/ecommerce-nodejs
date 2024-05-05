"use strict";

const { getUnSelectData, getSelectData } = require("../../utils");

const checkDiscountExists = async ({model, filter}) => {
  return await model.findOne(filter).lean();
};

const findAllDisCountCodeUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discounts = model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean()
    .exec();
  return discounts;
};

const findAllDisCountCodeSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discounts = model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();
  return discounts;
};

module.exports = {
  checkDiscountExists,
  findAllDisCountCodeUnSelect,
  findAllDisCountCodeSelect,
};
