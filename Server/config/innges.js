import { Inngest } from "inngest";
import { connectionDB } from "./db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({ id: "cyberCart" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },

  async ({ event }) => {
    await connectionDB();
    const { id, email_address, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkId: id,
      email: email_address[0].email_address,
      imageUrl: image_url,
      addresses: [],
      wishList: [],
    };
    await User.create(newUser);
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectionDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  }
);

export const functions = [syncUser, deleteUserFromDB];
