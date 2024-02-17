import { FilterExtractorFunction, LoggingFunction, TMap } from "../../../core/utilities/utilities";
import { stringifyDate, toBoolean } from "../../../core/utilities/conversion_helpers";
import { TFilterValue } from "../../../core/models/query.model";
import { EmployeePermissions } from "../../../core/constants";
import { wLogger } from "../../../core/utilities/logger";
import { ILog, TLogAction } from "../../../core/interfaces/log.interface";

const logger = wLogger("employee");
const feature = "employee.employee";
const type = "info";

export const auditLogging: LoggingFunction = (action: TLogAction, data: TMap): void => {
  const { createdAt, createdBy, updatedAt, updatedBy } = data;
  const who = updatedBy ?? createdBy;
  const at = stringifyDate(updatedAt ?? createdAt);

  const log: ILog = { type, at, who, feature, action, data };

  logger.log("info", JSON.stringify(log));
};

export const getEmployeeFilter: FilterExtractorFunction = (input: {
  _ids?: TFilterValue;
  name?: TFilterValue;
  firstName?: TFilterValue;
  lastName?: TFilterValue;
  middleName?: TFilterValue;
  phone?: TFilterValue;
  jobTitle?: TFilterValue;
  isActive?: TFilterValue;
}): TMap => {
  let filter: TMap = {};

  if (input._ids !== undefined && input._ids.equal !== undefined) {
    filter._id = { $in: input._ids.equal.replace(" ", "").split(",") };
  } else {
    if (input.name !== undefined && input.name.equal)
      filter.$or = [
        { firstName: { $regex: new RegExp(`^.*${input.name.equal}.*$`) } },
        { lastName: { $regex: new RegExp(`^.*${input.name.equal}.*$`) } },
        { middleName: { $regex: new RegExp(`^.*${input.name.equal}.*$`) } },
      ];

    if (input.firstName !== undefined && input.firstName.equal !== undefined)
      filter.firstName = { $regex: `^.*${input.firstName.equal}.*$` };

    if (input.lastName !== undefined && input.lastName.equal !== undefined)
      filter.lastName = { $regex: `^.*${input.lastName.equal}.*$` };

    if (input.middleName !== undefined && input.middleName.equal !== undefined)
      filter.middleName = { $regex: `^.*${input.middleName.equal}.*$` };

    if (input.phone !== undefined && input.phone.equal !== undefined)
      filter.phone = { $regex: `^.*${input.phone.equal}.*$` };

    if (input.jobTitle !== undefined && input.jobTitle.equal !== undefined)
      filter.jobTitle = input.jobTitle.equal;

    if (input.isActive !== undefined && input.isActive.equal !== undefined)
      filter.isActive = toBoolean(input.isActive.equal);
  }

  return filter;
};

export let defaultPermission: Record<string, EmployeePermissions[]> = {
  "general manager": [
    EmployeePermissions.registerGuest,
    EmployeePermissions.updateGuestInfo,

    EmployeePermissions.createRoom,
    EmployeePermissions.updateRoomInfo,
    EmployeePermissions.updateRoomStatus,

    EmployeePermissions.bookingARoom,
    EmployeePermissions.giftBookingARoom,
    EmployeePermissions.voidBookingARoom,
    EmployeePermissions.updateBookingInfo,
    EmployeePermissions.updateBookingPrice,

    EmployeePermissions.acceptAccommodationPayment,
    EmployeePermissions.updateAccommodationPayment,

    EmployeePermissions.makeMenu,
    EmployeePermissions.updateMenu,
    EmployeePermissions.updateMenuPrice,

    EmployeePermissions.viewMyOrder,
    EmployeePermissions.viewAllOrder,
    EmployeePermissions.postOrder,
    EmployeePermissions.updateOrder,
    EmployeePermissions.updateAllOrder,
    EmployeePermissions.giftOrder,
    EmployeePermissions.voidOrder,
    EmployeePermissions.transferOrder,

    EmployeePermissions.acceptRestaurantPayment,
    EmployeePermissions.updateRestaurantPayment,

    EmployeePermissions.addItemToInventory,
    EmployeePermissions.updateItemInfo,

    EmployeePermissions.makeMenuVsRecipe,
    EmployeePermissions.spoilageMiscellaneousUsage,

    EmployeePermissions.issueItem,
    EmployeePermissions.updateIssue,

    EmployeePermissions.purchaseItem,
    EmployeePermissions.updatePurchase,

    EmployeePermissions.registerEmployee,
    EmployeePermissions.updateEmployeeInfo,
    EmployeePermissions.updateEmployeePermissions,

    EmployeePermissions.addExpense,
    EmployeePermissions.updateExpense,

    EmployeePermissions.verifyPayment,
    EmployeePermissions.generateMyReport,
    EmployeePermissions.generateAccommodationReport,
    EmployeePermissions.generateRestaurantReport,
    EmployeePermissions.generateInventoryReport,
    EmployeePermissions.generateGeneralReport,
  ],
  supervisor: [
    EmployeePermissions.registerGuest,
    EmployeePermissions.updateGuestInfo,

    EmployeePermissions.createRoom,
    EmployeePermissions.updateRoomInfo,
    EmployeePermissions.updateRoomStatus,

    EmployeePermissions.bookingARoom,
    EmployeePermissions.giftBookingARoom,
    EmployeePermissions.voidBookingARoom,
    EmployeePermissions.updateBookingInfo,
    EmployeePermissions.updateBookingPrice,

    EmployeePermissions.acceptAccommodationPayment,
    EmployeePermissions.updateAccommodationPayment,

    EmployeePermissions.makeMenu,
    EmployeePermissions.updateMenu,
    EmployeePermissions.updateMenuPrice,

    EmployeePermissions.viewMyOrder,
    EmployeePermissions.viewAllOrder,
    EmployeePermissions.postOrder,
    EmployeePermissions.updateOrder,
    EmployeePermissions.updateAllOrder,
    EmployeePermissions.giftOrder,
    EmployeePermissions.voidOrder,
    EmployeePermissions.transferOrder,

    EmployeePermissions.acceptRestaurantPayment,
    EmployeePermissions.updateRestaurantPayment,

    EmployeePermissions.addItemToInventory,
    EmployeePermissions.updateItemInfo,

    EmployeePermissions.makeMenuVsRecipe,
    EmployeePermissions.spoilageMiscellaneousUsage,

    EmployeePermissions.issueItem,
    EmployeePermissions.updateIssue,

    EmployeePermissions.purchaseItem,
    EmployeePermissions.updatePurchase,

    EmployeePermissions.registerEmployee,
    EmployeePermissions.updateEmployeeInfo,

    EmployeePermissions.addExpense,
    EmployeePermissions.updateExpense,

    EmployeePermissions.generateMyReport,
    EmployeePermissions.generateAccommodationReport,
    EmployeePermissions.generateRestaurantReport,
    EmployeePermissions.generateInventoryReport,
  ],
  "accommodation supervisor": [
    EmployeePermissions.registerGuest,
    EmployeePermissions.updateGuestInfo,

    EmployeePermissions.createRoom,
    EmployeePermissions.updateRoomInfo,
    EmployeePermissions.updateRoomStatus,

    EmployeePermissions.bookingARoom,
    EmployeePermissions.giftBookingARoom,
    EmployeePermissions.voidBookingARoom,
    EmployeePermissions.updateBookingInfo,
    EmployeePermissions.updateBookingPrice,

    EmployeePermissions.acceptAccommodationPayment,
    EmployeePermissions.updateAccommodationPayment,

    EmployeePermissions.registerEmployee,
    EmployeePermissions.updateEmployeeInfo,

    EmployeePermissions.addExpense,
    EmployeePermissions.updateExpense,

    EmployeePermissions.generateMyReport,
    EmployeePermissions.generateAccommodationReport,
    EmployeePermissions.generateInventoryReport,
  ],
  reception: [
    EmployeePermissions.registerGuest,
    EmployeePermissions.updateGuestInfo,

    EmployeePermissions.createRoom,
    EmployeePermissions.updateRoomInfo,
    EmployeePermissions.updateRoomStatus,

    EmployeePermissions.bookingARoom,
    EmployeePermissions.voidBookingARoom,
    EmployeePermissions.updateBookingInfo,
    EmployeePermissions.updateBookingPrice,

    EmployeePermissions.acceptAccommodationPayment,
    EmployeePermissions.updateAccommodationPayment,

    EmployeePermissions.addExpense,
    EmployeePermissions.updateExpense,

    EmployeePermissions.generateMyReport,
    EmployeePermissions.generateAccommodationReport,
  ],
  housekeeper: [
    EmployeePermissions.createRoom,
    EmployeePermissions.updateRoomInfo,
    EmployeePermissions.updateRoomStatus,

    EmployeePermissions.generateMyReport,
  ],
  security: [
    EmployeePermissions.createRoom,
    EmployeePermissions.updateRoomInfo,
    EmployeePermissions.updateRoomStatus,

    EmployeePermissions.generateMyReport,
  ],
  "restaurant supervisor": [
    EmployeePermissions.makeMenu,
    EmployeePermissions.updateMenu,
    EmployeePermissions.updateMenuPrice,

    EmployeePermissions.viewMyOrder,
    EmployeePermissions.viewAllOrder,
    EmployeePermissions.postOrder,
    EmployeePermissions.updateOrder,
    EmployeePermissions.updateAllOrder,
    EmployeePermissions.giftOrder,
    EmployeePermissions.voidOrder,
    EmployeePermissions.transferOrder,

    EmployeePermissions.acceptRestaurantPayment,
    EmployeePermissions.updateRestaurantPayment,

    EmployeePermissions.addItemToInventory,
    EmployeePermissions.updateItemInfo,

    EmployeePermissions.makeMenuVsRecipe,
    EmployeePermissions.spoilageMiscellaneousUsage,

    EmployeePermissions.issueItem,
    EmployeePermissions.updateIssue,

    EmployeePermissions.purchaseItem,
    EmployeePermissions.updatePurchase,

    EmployeePermissions.registerEmployee,
    EmployeePermissions.updateEmployeeInfo,

    EmployeePermissions.addExpense,
    EmployeePermissions.updateExpense,

    EmployeePermissions.generateMyReport,
    EmployeePermissions.generateRestaurantReport,
    EmployeePermissions.generateInventoryReport,
  ],
  cashier: [
    EmployeePermissions.makeMenu,
    EmployeePermissions.updateMenu,
    EmployeePermissions.updateMenuPrice,

    EmployeePermissions.viewMyOrder,
    EmployeePermissions.viewAllOrder,
    EmployeePermissions.postOrder,
    EmployeePermissions.updateOrder,
    EmployeePermissions.updateAllOrder,
    EmployeePermissions.giftOrder,
    EmployeePermissions.voidOrder,
    EmployeePermissions.transferOrder,

    EmployeePermissions.acceptRestaurantPayment,
    EmployeePermissions.updateRestaurantPayment,

    EmployeePermissions.addExpense,
    EmployeePermissions.updateExpense,

    EmployeePermissions.generateMyReport,
    EmployeePermissions.generateRestaurantReport,
  ],
  waiter: [
    EmployeePermissions.viewMyOrder,
    EmployeePermissions.postOrder,
    EmployeePermissions.updateOrder,
    EmployeePermissions.updateAllOrder,
    EmployeePermissions.giftOrder,
    EmployeePermissions.voidOrder,
    EmployeePermissions.transferOrder,

    EmployeePermissions.acceptRestaurantPayment,
    EmployeePermissions.updateRestaurantPayment,

    EmployeePermissions.generateMyReport,
  ],
  chef: [
    EmployeePermissions.viewMyOrder,
    EmployeePermissions.viewAllOrder,

    EmployeePermissions.addItemToInventory,
    EmployeePermissions.updateItemInfo,

    EmployeePermissions.makeMenuVsRecipe,
    EmployeePermissions.spoilageMiscellaneousUsage,

    EmployeePermissions.generateMyReport,
    EmployeePermissions.generateInventoryReport,
  ],
  cook: [
    EmployeePermissions.viewMyOrder,
    EmployeePermissions.viewAllOrder,

    EmployeePermissions.addItemToInventory,
    EmployeePermissions.updateItemInfo,

    EmployeePermissions.makeMenuVsRecipe,
    EmployeePermissions.spoilageMiscellaneousUsage,

    EmployeePermissions.generateMyReport,
    EmployeePermissions.generateInventoryReport,
  ],
  steward: [
    EmployeePermissions.viewMyOrder,
    EmployeePermissions.viewAllOrder,

    EmployeePermissions.spoilageMiscellaneousUsage,

    EmployeePermissions.generateMyReport,
  ],
  trainee: [
    EmployeePermissions.viewMyOrder,
    EmployeePermissions.postOrder,
    EmployeePermissions.updateOrder,

    EmployeePermissions.acceptRestaurantPayment,
    EmployeePermissions.updateRestaurantPayment,

    EmployeePermissions.generateMyReport,
  ],
  handyman: [EmployeePermissions.updateRoomInfo, EmployeePermissions.generateMyReport],
  storekeeper: [
    EmployeePermissions.makeMenu,
    EmployeePermissions.updateMenu,
    EmployeePermissions.updateMenuPrice,

    EmployeePermissions.viewMyOrder,
    EmployeePermissions.viewAllOrder,

    EmployeePermissions.addItemToInventory,
    EmployeePermissions.updateItemInfo,

    EmployeePermissions.makeMenuVsRecipe,
    EmployeePermissions.spoilageMiscellaneousUsage,

    EmployeePermissions.issueItem,
    EmployeePermissions.updateIssue,

    EmployeePermissions.purchaseItem,
    EmployeePermissions.updatePurchase,

    EmployeePermissions.addExpense,
    EmployeePermissions.updateExpense,

    EmployeePermissions.generateMyReport,
    EmployeePermissions.generateRestaurantReport,
    EmployeePermissions.generateInventoryReport,
  ],
  "software admin": [
    EmployeePermissions.registerGuest,
    EmployeePermissions.updateGuestInfo,

    EmployeePermissions.createRoom,
    EmployeePermissions.updateRoomInfo,
    EmployeePermissions.updateRoomStatus,

    EmployeePermissions.bookingARoom,
    EmployeePermissions.giftBookingARoom,
    EmployeePermissions.voidBookingARoom,
    EmployeePermissions.updateBookingInfo,
    EmployeePermissions.updateBookingPrice,

    EmployeePermissions.acceptAccommodationPayment,
    EmployeePermissions.updateAccommodationPayment,

    EmployeePermissions.makeMenu,
    EmployeePermissions.updateMenu,
    EmployeePermissions.updateMenuPrice,

    EmployeePermissions.viewMyOrder,
    EmployeePermissions.viewAllOrder,
    EmployeePermissions.postOrder,
    EmployeePermissions.updateOrder,
    EmployeePermissions.updateAllOrder,
    EmployeePermissions.giftOrder,
    EmployeePermissions.voidOrder,
    EmployeePermissions.transferOrder,

    EmployeePermissions.acceptRestaurantPayment,
    EmployeePermissions.updateRestaurantPayment,

    EmployeePermissions.addItemToInventory,
    EmployeePermissions.updateItemInfo,

    EmployeePermissions.makeMenuVsRecipe,
    EmployeePermissions.spoilageMiscellaneousUsage,

    EmployeePermissions.issueItem,
    EmployeePermissions.updateIssue,

    EmployeePermissions.purchaseItem,
    EmployeePermissions.updatePurchase,

    EmployeePermissions.registerEmployee,
    EmployeePermissions.updateEmployeeInfo,
    EmployeePermissions.updateEmployeePermissions,

    EmployeePermissions.addExpense,
    EmployeePermissions.updateExpense,

    EmployeePermissions.verifyPayment,
    EmployeePermissions.generateMyReport,
    EmployeePermissions.generateAccommodationReport,
    EmployeePermissions.generateRestaurantReport,
    EmployeePermissions.generateInventoryReport,
    EmployeePermissions.generateGeneralReport,
  ],
};
