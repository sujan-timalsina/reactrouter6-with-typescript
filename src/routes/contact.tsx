// import { Form, useLoaderData, LoaderFunction, ActionFunctionArgs, Params, ParamParseKey } from "react-router-dom";
import { Form, useLoaderData, LoaderFunction, useFetcher, ActionFunction } from "react-router-dom";
import { ContactTypes, getContact, updateContact } from "../contacts";

// type ContactTypes = {
//     first: string,
//     last: string,
//     avatar: string,
//     twitter: string,
//     notes: string,
//     favorite: boolean,
// };

type ContactLoaderData = {
    contact: ContactTypes;
};

type LoaderParams = {
    contactId: string;
};

// const Paths = {
//     contactDetail: "/todos/:contactId",
// } as const;

// interface ContactLoaderArgs extends ActionFunctionArgs {
//     params: Params<ParamParseKey<typeof Paths.contactDetail>>;
// }

// export async function loader({ params }: { params: LoaderParams }) {
//     const contact = await getContact(params.contactId);
//     return { contact };
// };

export const loader: LoaderFunction = async ({ params }) => {
    const typedParams = params as unknown as LoaderParams;
    const contact = await getContact(typedParams.contactId);
    if (!contact) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        });
    }
    return { contact };
}

export const action: ActionFunction = async ({ request, params }) => {
    const typedParams = params as unknown as LoaderParams;
    let formData = await request.formData();
    return updateContact(typedParams.contactId, {
        favorite: formData.get("favorite") === "true",
    });
}

const Favorite = ({ contact }: { contact: Partial<ContactTypes> }) => {
    const fetcher = useFetcher();
    // yes, this is a `let` for later
    let favorite = contact.favorite;
    if (fetcher.formData) {
        favorite = fetcher.formData.get("favorite") === "true";
    }

    return (
        <fetcher.Form method="post">
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    );
}

const Contact = () => {
    const { contact } = useLoaderData() as ContactLoaderData;

    // const contact: Omit<ContactTypes, 'id' | 'createdAt'> = {
    // const contact: Partial<ContactTypes> = {
    //     first: "Your",
    //     last: "Name",
    //     avatar: "https://placekitten.com/g/200/200",
    //     twitter: "your_handle",
    //     notes: "Some notes",
    //     favorite: true,
    // };

    return (
        <div id="contact">
            <div>
                <img
                    key={contact.avatar}
                    src={contact.avatar}
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact} />
                </h1>

                {contact.twitter && (
                    <p>
                        <a
                            target="_blank"
                            href={`https://twitter.com/${contact.twitter}`}
                        >
                            {contact.twitter}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={(event) => {
                            if (
                                !confirm(
                                    "Please confirm you want to delete this record."
                                )
                            ) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Contact;