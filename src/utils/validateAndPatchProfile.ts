import { CookieException } from "../common/CookieException";
import { log } from "../common/logger";
import { profileRepo } from "../common/repos";
import { DEFAULT_PROFILE, UserProfile, getDefaultProfileForId } from "../common/schemas/UserProfile";
import { sendToLogChannel } from "./sendToLogChannel";

export const validateAndPatchProfile = async (id: string, profile: UserProfile) => {
    // TODO: Remove profile.bg and DEFAULT entirely after v1 deprecation
    if (!profile) {
        profile = getDefaultProfileForId(id);
        return (await profileRepo.set(id, profile) as UserProfile);
    }

    let needsPatch = false;
    if (profile.id && id !== profile.id) {
        log.error(sendToLogChannel(`[Profile Validation] Error Patching Profile for User Id : ${id} - Profile Id : ${profile.id} Mismatch`));
        throw new CookieException("User Profile is not in a valid state.");
    }
    if (!profile.background || profile.background === "YUQI_REVEAL") {
        profile.background = DEFAULT_PROFILE.background;
        needsPatch = true;
    }
    if (!profile.badge1) {
        profile.badge1 = DEFAULT_PROFILE.badge1;
        needsPatch = true;
    }
    if (!profile.badge2) {
        profile.badge2 = DEFAULT_PROFILE.badge2;
        needsPatch = true;
    }
    if (profile.level === null || profile.level === undefined) {
        profile.level = DEFAULT_PROFILE.level;
        needsPatch = true;
    }
    if (profile.xp === null || profile.xp === undefined) {
        profile.xp = DEFAULT_PROFILE.xp;
        needsPatch = true;
    }

    if (!needsPatch)
        return profile;

    try {
        log.info(`[Profile Validation] Patching profile for User Id: ${id}`);
        return (await profileRepo.set(id, profile) as UserProfile);
    } catch (err) {
        log.error(sendToLogChannel(`[Profile Validation] Error Patching Profile for User Id : ${id}\n${err}`));
        throw new CookieException("User Profile is not in a valid state.");
    }
}