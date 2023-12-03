import { assetsRepo, shopRepo } from "../common/repos";

// Timestamp Guide
// - 3 parts aaa_bb_ccc
// - aaa = era, starts at 100 
// - - eg: I Made = 101
// - bb = version, starts at 10 
// - - eg: I Trust (True) = 103_10
// - - eg: I Trust (Lie) = 103_11
// - ccc = member, starts at 000, ensure Yuqi right after group, rest alphabetical
// - - as of 2023:
// - - 000 - Soyeon
// - - 001 - Soojin
// - - 002 - Shuhua
// - - 003 - Miyeon
// - - 004 - Minnie
// - - 005 - Yuqi (ensure, right after group images)
// - - 006+ - Group

async function createAndPostPayloads(id: string, name: string, src: string, tags: string[], ts: number) {
    const assetData = { id, name, src, tags, ts };
    const shopData = {
        id,
        name,
        eligibility: {},
        listed: true,
        stock: -1,
        type: "background",
        cost: 50
    };

    await assetsRepo.set(id, assetData);
    await shopRepo.set(id, shopData);
}

export async function updateBackgrounds() {
    // SOYEON
    createAndPostPayloads(
        "I_MADE_2_SOYEON",
        "I made - Soyeon",
        "https://i.imgur.com/n6m5hGv.jpg",
        ["soyeon"],
        101_11_000
    )

    createAndPostPayloads(
        "I_MADE_SOYEON",
        "I made - Soyeon",
        "https://i.imgur.com/gMTgt00.jpg",
        ["soyeon"],
        101_10_000
    )

    // SOOJIN
    createAndPostPayloads(
        "I_MADE_2_SOOJIN",
        "I made - Soojin",
        "https://i.imgur.com/hCfPoIb.jpg",
        ["soojin"],
        101_11_001
    )

    createAndPostPayloads(
        "I_MADE_SOOJIN",
        "I made - Soojin",
        "https://i.imgur.com/jIoBGLq.jpg",
        ["soojin"],
        101_10_001
    )

    // MIYEON
    createAndPostPayloads(
        "I_MADE_2_MIYEON",
        "I made - Miyeon",
        "https://i.imgur.com/91MYcSP.jpg",
        ["miyeon"],
        101_11_003
    )

    createAndPostPayloads(
        "I_MADE_MIYEON",
        "I made - Miyeon",
        "https://i.imgur.com/sYm0wZA.jpg",
        ["miyeon"],
        101_10_003
    )

    // MINNIE
    createAndPostPayloads(
        "I_MADE_2_MINNIE",
        "I made - Minnie",
        "https://i.imgur.com/VjjgquP.jpg",
        ["minnie"],
        101_11_004
    )

    createAndPostPayloads(
        "I_MADE_MINNIE",
        "I made - Minnie",
        "https://i.imgur.com/Q0jdYrb.jpg",
        ["minnie"],
        101_10_004
    )

    // SHUHUA
    createAndPostPayloads(
        "I_MADE_2_SHUHUA",
        "I made - Shuhua",
        "https://i.imgur.com/1lxBcPs.jpg",
        ["shuhua"],
        101_11_002
    )

    createAndPostPayloads(
        "I_MADE_SHUHUA",
        "I made - Shuhua",
        "https://i.imgur.com/TvcHaIQ.jpg",
        ["shuhua"],
        101_10_002
    )

    // YUQI
    createAndPostPayloads(
        "I_MADE_2_YUQI",
        "I made - Yuqi",
        "https://i.imgur.com/d7KEeLf.jpg",
        ["yuqi"],
        101_11_005
    )

    createAndPostPayloads(
        "I_MADE_YUQI",
        "I made - Yuqi",
        "https://i.imgur.com/A9elXy8.jpg",
        ["yuqi"],
        101_10_005
    )
}