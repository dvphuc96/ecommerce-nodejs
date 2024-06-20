"use strict";

const { getDiscountAmount } = require("../../services/DiscountService");

const calculateTotalPriceAndDiscount = async (shop_discounts, userId, shopId, products) => {
    // Tạo danh sách các promises cho từng phần tử trong shop_discounts
    const discountPromises = shop_discounts.map(async discountItem => 
        await getDiscountAmount({
          codeId: discountItem.codeId,
          userId,
          shopId,
          products,
        })
      );
    
      // Đợi tất cả các promises hoàn thành
      const discountResults = await Promise.all(discountPromises);
      console.log({discountResults});
    
      // Tính tổng giá trị và chiết khấu
      const totalPrice = discountResults.reduce((acc, {totalPrice = 0}) => acc + totalPrice, 0);
      const discount = discountResults.reduce((acc, {discount = 0}) => acc + discount, 0);
      
      return { totalPrice, discount };
}

module.exports = {
    calculateTotalPriceAndDiscount,
}