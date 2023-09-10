import { USER_URL } from "../utils/constants/common"

export const getInventoryLinkForUserId = (id: string) => {
    return `${USER_URL}/${id}`;
}