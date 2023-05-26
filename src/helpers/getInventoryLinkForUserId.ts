import { USER_URL } from "../utils/constants"

export const getInventoryLinkForUserId = (id: string) => {
    return `${USER_URL}/${id}`;
}