import { CompanyWebsite } from "../company_website";

/**
 * Collection path: /companies/{company_uuid}/companiesWebsitesMetadata/{uuid}
 */
export type CompanyWebsiteMetadata = {
    uuid: CompanyWebsite['uuid'];

    // Metadata
    addedAt: Date;
    addedByRef: string;
    deletedAt: Date | null;
    deletedByRef: string | null;
}