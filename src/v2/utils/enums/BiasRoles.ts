import ReactionRole from "../../entities/ReactionRole";

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

export const BiasRoles = {
    Main,
    Sub
};