  //利用split("x")将"ITEM0001 x 1"分离成id: 'ITEM0001', count: 1
  function separate(selectedItems) {
    let selectedItemsSeparated = [];
    for (let item of selectedItems) {
      let id_selectedItems = item.split("x")[0].trim();
      let count_selectedItems = Number(item.split("x")[1].trim());
      selectedItemsSeparated.push({id: id_selectedItems, count: count_selectedItems});
    }
    return selectedItemsSeparated;
  }

//获得完整的选购商品的信息
  function merge(selectedItemsSeparated) {
    let itemInfo = [];
    for(let itemOfAll of loadAllItems()){
      for(let itemOfSelect of selectedItemsSeparated ){
        if(itemOfAll.id === itemOfSelect.id){
          itemInfo.push(Object.assign(itemOfAll,itemOfSelect));
        }
      }
    }
    itemInfo.map(value => value.itemTotalPrice = value.price * value.count);
    return itemInfo;
  }

  //满30减6
  function PromotionsOver30Minus6(originalPrice) {
  let discountOver30Minus6 = {};
    if(originalPrice >= 30){
      discountOver30Minus6.savedMoney = 6;
      discountOver30Minus6.spendMoney = originalPrice - 6;
      discountOver30Minus6.preferentialType = loadPromotions()[0].type;
    }
    return discountOver30Minus6;
  }

  //指定菜品半价
  function PromotionsItemsHalf(itemInfo,originalPrice) {
  var discountItemsHalf = {};
    discountItemsHalf.savedMoney = 0;
    let designatedGoods = [];
    for (let item of itemInfo){
      if(item.id === loadPromotions()[1].items[0] || item.id === loadPromotions()[1].items[1]){
        discountItemsHalf.savedMoney += item.itemTotalPrice / 2;
        designatedGoods.push(item.name);
      }
    }
    discountItemsHalf.preferentialType = loadPromotions()[1].type.concat("("+ designatedGoods.map(value => value)+")");
    discountItemsHalf.spendMoney = originalPrice - discountItemsHalf.savedMoney;
    return discountItemsHalf;
  }

  //计算原总价
  function getOriginalPrice(itemInfo) {
    let originalPrice = 0;
    itemInfo.map(value => originalPrice += value.itemTotalPrice);
    return originalPrice;
  }

  // 选择优惠
  function determineDiscount(itemInfo,originalPrice) {
    let discountItemsHalf =  PromotionsItemsHalf(itemInfo,originalPrice);
    let discountOver30Minus6 =  PromotionsOver30Minus6(originalPrice);

    if(discountItemsHalf.spendMoney < discountOver30Minus6.spendMoney ){
      return discountItemsHalf;
    } else {
      return discountOver30Minus6;
    }
  }

  //商品明细
  function getItemList(itemInfo) {
    let itemInventory = "";
    let itemList = "";
    itemInfo.map(value => {
      itemInventory += value.name + " x " + value.count + " = " + value.itemTotalPrice + "元\n";
    })
    itemList = "============= 订餐明细 =============" +"\n" + itemInventory;
    return itemList;
  }

  //优惠及总价明细
  function getDiscountList(itemInfo, originalPrice, discount) {
    let discountList = "";
    for (let item of itemInfo) {
      if (item.id !== loadPromotions()[1].items[0] && item.id !== loadPromotions()[1].items[1] && originalPrice < 30) {
        discountList = "" + "-----------------------------------\n" + "总计：" +originalPrice +"元\n" +
          "===================================";
      } else {
        discountList = "-----------------------------------\n" +
          "使用优惠:\n" +
          discount.preferentialType + "，省" + discount.savedMoney + "元\n" +
          "-----------------------------------\n" + "总计：" +discount.spendMoney +"元\n" +
          "==================================="
      }
    }
    return discountList;
  }

  //打印收据
  function printReceipts(itemInfo,discount,originalPrice) {
    let receipt = "";
    receipt =  getItemList(itemInfo) + getDiscountList(itemInfo, originalPrice, discount);
    return receipt;

  }

  function bestCharge(selectedItems) {
    let selectedItemsSeparated = separate(selectedItems);
    let itemInfo = merge(selectedItemsSeparated);
    let originalPrice = getOriginalPrice(itemInfo);
    let discount = determineDiscount(itemInfo,originalPrice);
    return  printReceipts(itemInfo,discount,originalPrice);
  }

