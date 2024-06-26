"use strict";

const { resolve } = require("path");
const redis = require("redis");
const { promisify } = require("util");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  // khi có client vào mua sẽ tạo 1 key, rồi đưa cho người mua trước, khi người mua trước thực hiện xog sẽ chuyển key cho người tiếp theo
  // thuật toán acquirelock (khoá bi quan và khoá lạc quan)
  const key = `lock_v2024_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3s chờ (tạm lock)

  for (let i = 0; i < retryTimes.length; i++) {
    // tạo 1 key, ai nắm giữ thì dc vào thanh toán.
    // result: trả thành công = 1, không thành công = 0
    // key chưa ai giữ trả về 1, có rồi thì cấp cho người khác trả về 0
    const result = await setnxAsync(key, expireTime);
    console.log({ result });
    if (result === 1) {
      // thao tác với inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

// xoá keyLock
const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
