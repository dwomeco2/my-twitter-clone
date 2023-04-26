import { atom } from "jotai";
import { type Session } from "next-auth";

const userAtom = atom<Session["user"]>(null);

const readonlyUserAtom = atom((get) => get(userAtom));

export { readonlyUserAtom };
