import ReactionRole from "../entities/ReactionRole";

export enum Guilds {
    YUQICORD = "426340011802099712"
}

export enum BiasEmbeds {
    MAIN = "691340747378655272",
    SUB = "691340818224644096",
}

const Main = {
    YUQI: new ReactionRole("426340286076157952", "Yuqi", "🍪"),
    SOYEON: new ReactionRole("426340586572873728", "Soyeon", "☠️"),
    SHUHUA: new ReactionRole("426340512719437824", "Shuhua", "📚"),
    SOOJIN: new ReactionRole("426340562090721281", "Soojin", "🥞"),
    MINNIE: new ReactionRole("442985807490449409", "Minnie", "🎹"),
    MIYEON: new ReactionRole("426340623478423553", "Miyeon", "🍜"),
    OT6: new ReactionRole("684031710756995078", "OT6", "idleblob"),
}

const Sub = {
    _YUQI: new ReactionRole("684027789531545636", ".Yuqi", "🍪"),
    _SOYEON: new ReactionRole("684027841595310111", ".Soyeon", "☠️"),
    _SHUHUA: new ReactionRole("684027970293071914", ".Shuhua", "📚"),
    _SOOJIN: new ReactionRole("684028021744861269", ".Soojin", "🥞"),
    _MINNIE: new ReactionRole("684027934767317002", ".Minnie", "🎹"),
    _MIYEON: new ReactionRole("684028050639159317", ".Miyeon", "🍜"),
    _GGOMO: new ReactionRole("691290092714852363", ".Ggomo", "🐱")
}

export const BiasRoles = { Main, Sub };

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