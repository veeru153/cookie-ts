export enum Errors {
    CHANNEL_TYPE_NOT_TEXT = "Channel is not a TextChannel",
    ROLE_REACTION_UNKNOWN_ACTION = "Action was not ADD_ROLE or REMOVE_ROLE",

    // Scopes and Permissions
    MISSING_SCOPE = "Scope Null or Empty",
    MISSING_PERMS = "Missing Permissions",

    // Shop
    SHOP_ITEM_NOT_FOUND = "Item does not exist",
    SHOP_ITEM_UNLISTED = "Item is currently not available for sale",
    SHOP_USER_LEVEL_LOW = "Item Locked. Item can be purchased at a higher level",
    SHOP_ITEM_TIME_LIMITED = "Limited Item",
    SHOP_MEMBERSHIP_TIME_TOO_LOW = "Item Locked. Spend more time with us to unlock",
    SHOP_NOT_ENOUGH_COINS = "Not enough coins",
    SHOP_USER_HAS_ITEM = "You already have the item",
    SHOP_ITEM_OUT_OF_STOCK = "Item is out of stock",
}