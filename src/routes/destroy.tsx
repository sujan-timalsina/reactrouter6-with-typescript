import { ActionFunction, redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

type ActionParams = {
    contactId: string;
};

export const action: ActionFunction = async ({ params }) => {
    const typedParams = params as unknown as ActionParams;
    await deleteContact(typedParams.contactId);
    return redirect("/");
}