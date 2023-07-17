import { useEffect, useState } from "react";
import { Outlet, NavLink, useLoaderData, Form, redirect, useNavigation, LoaderFunction, useSubmit } from "react-router-dom";
import { ContactTypes, createContact, getContacts } from "../contacts";

// type LoaderAllParams = {
//     request: Request;
// }

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    // if (q === null) {
    //     const contacts = await getContacts();
    //     return { contacts, q: undefined };
    // }

    const contacts = await getContacts(q);
    return { contacts, q };
}

export async function action() {
    const contact = await createContact();
    // return { contact };
    return redirect(`/contacts/${contact.id}/edit`);
}

type LoaderData = {
    contacts: ContactTypes[];
    q: string | undefined;
}

const Root = () => {
    const { contacts, q } = useLoaderData() as LoaderData;
    const [query, setQuery] = useState(q);
    const navigation = useNavigation();
    const submit = useSubmit();

    const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

    useEffect(() => {
        setQuery(q);
    }, [q]);

    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            className={searching ? "loading" : ""}
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            // defaultValue={q}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                const isFirstSearch = q == null;
                                submit(e.currentTarget.form, {
                                    replace: !isFirstSearch,
                                });
                                // submit(e.currentTarget.form);
                            }}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    <NavLink
                                        to={`contacts/${contact.id}`}
                                        className={({ isActive, isPending }) =>
                                            isActive
                                                ? "active"
                                                : isPending
                                                    ? "pending"
                                                    : ""
                                        }
                                    >
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}{" "}
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div
                id="detail"
                className={
                    navigation.state === "loading" ? "loading" : ""
                }
            >
                <Outlet />
            </div>
        </>
    );
};

export default Root;