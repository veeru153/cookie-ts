export enum Errors {
    CHANNEL_TYPE_NOT_TEXT = "Channel is not a TextChannel",
    ROLE_REACTION_UNKNOWN_ACTION = "Action was not ADD_ROLE or REMOVE_ROLE",

    // Scopes and Permissions
    MISSING_SCOPE = "Scope Null or Empty",
    MISSING_PERMS = "Missing Permissions",
}

export enum ShopErrors {
    ITEM_NOT_FOUND = "Item does not exist",
    ITEM_UNLISTED = "Item is currently not available for sale",
    USER_LEVEL_LOW = "Item Locked. Item can be purchased at a higher level",
    ITEM_TIME_LIMITED = "Limited Item",
    MEMBERSHIP_TIME_TOO_LOW = "Item Locked. Spend more time with us to unlock",
    NOT_ENOUGH_COINS = "Not enough coins",
    USER_HAS_ITEM = "You already have the item",
    ITEM_OUT_OF_STOCK = "Item is out of stock",
    UNEXPECTED_ERROR = "An unexpected error occurred",
}