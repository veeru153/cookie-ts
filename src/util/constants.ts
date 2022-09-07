import BiasRole from "../entities/BiasRole";

export enum Guilds {
    YUQICORD = "426340011802099712"
}

export enum BiasEmbeds {
    MAIN = "691340747378655272",
    SUB = "691340818224644096",
}

const Main = {
    YUQI: new BiasRole("426340286076157952", "Yuqi", "🍪"),
    SOYEON: new BiasRole("426340586572873728", "Soyeon", "☠️"),
    SHUHUA: new BiasRole("426340512719437824", "Shuhua", "📚"),
    SOOJIN: new BiasRole("426340562090721281", "Soojin", "🥞"),
    MINNIE: new BiasRole("442985807490449409", "Minnie", "🎹"),
    MIYEON: new BiasRole("426340623478423553", "Miyeon", "🍜"),
    OT6: new BiasRole("684031710756995078", "OT6", "idleblob"),
}

const Sub = {
    _YUQI: new BiasRole("684027789531545636", ".Yuqi", "🍪"),
    _SOYEON: new BiasRole("684027841595310111", ".Soyeon", "☠️"),
    _SHUHUA: new BiasRole("684027970293071914", ".Shuhua", "📚"),
    _SOOJIN: new BiasRole("684028021744861269", ".Soojin", "🥞"),
    _MINNIE: new BiasRole("684027934767317002", ".Minnie", "🎹"),
    _MIYEON: new BiasRole("684028050639159317", ".Miyeon", "🍜"),
    _GGOMO: new BiasRole("691290092714852363", ".Ggomo", "🐱")
}

export const BiasRoles = { Main, Sub };

export enum Errors {
    CHANNEL_TYPE_NOT_TEXT = "Channel is not a TextChannel",
    ROLE_REACTION_UNKNOWN_ACTION = "Action was not ADD_ROLE or REMOVE_ROLE",

    // Scopes and Permissions
    MISSING_SCOPE = "Scope Null or Empty",
    MISSING_PERMS = "Missing Permissions",
}