import client from "../common/client"
import { Guild } from "../common/enums/Guilds";
import { log } from "../common/logger";

export const getMemberFromId = async (id: string) => {
    try {
        const guild = await client.guilds.fetch(Guild.YUQICORD);
        if (!guild.available) {
            log.info('[MemberService] Guild is facing a server outage.');
            return null;
        }
        const member = await guild.members.fetch(id);
        return member;
    } catch (err) {
        log.warn(`[MemberService] Could not fetch member details : ${err}`);
        return null;
    }
}