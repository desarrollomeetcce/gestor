'use server'
import { getAllLinkTypesAction } from "./application/actions";
import LinkTypePageClient from "./components/link-type-page-client";



export default async function LinkTypePage() {
    const linkTypes = await getAllLinkTypesAction();
    return <LinkTypePageClient linkTypes={linkTypes} />;
}