import client from "../utils/client"
import { Guild } from "../utils/enums/Guilds";
import { log } from "../utils/logger";

export const getMemberFromId = async (id: string) => {
    try {
        const guild = await client.guilds.fetch(Guild.YUQICORD);
        if (!guild.available) {
            log.info('[MemberService] Guild is facing a server outage.');
            return null;
        }
        const member = await guild.members.fetch(id);
        return member.user.tag;
    } catch (err) {
        log.warn(`[MemberService] Could not fetch member details : ${err}`);
        return null;
    }
}