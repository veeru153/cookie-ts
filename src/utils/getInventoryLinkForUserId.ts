import { USER_URL } from "../common/constants/common"

export const getInventoryLinkForUserId = (id: string) => {
    return `${USER_URL}/${id}`;
}